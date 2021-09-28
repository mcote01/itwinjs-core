/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module RpcInterface
 */

import { AccessToken, BentleyStatus, getErrorProps, GuidString, IModelStatus, Logger, RpcInterfaceStatus } from "@bentley/bentleyjs-core";
import { CommonLoggerCategory } from "../../CommonLoggerCategory";
import { IModelRpcProps } from "../../IModel";
import { IModelError } from "../../IModelError";
import { RpcInterface } from "../../RpcInterface";
import { SessionProps } from "../../SessionProps";
import { RpcConfiguration } from "./RpcConfiguration";
import { RpcProtocolEvent, RpcRequestStatus } from "./RpcConstants";
import { RpcNotFoundResponse, RpcPendingResponse } from "./RpcControl";
import { RpcMarshaling, RpcSerializedValue } from "./RpcMarshaling";
import { RpcOperation } from "./RpcOperation";
import { RpcProtocol, RpcRequestFulfillment, SerializedRpcRequest } from "./RpcProtocol";
import { CURRENT_INVOCATION, RpcRegistry } from "./RpcRegistry";

/** The properties of an RpcActivity.
 * @public
 */
export interface RpcActivity extends SessionProps {
  /** Used for logging to correlate an Rpc activity between frontend and backend */
  readonly activityId: GuidString;

  /** access token for authorization  */
  readonly accessToken: AccessToken;
}

/** Serialized format for sending the request across the RPC layer
 * @public
 */
export interface SerializedRpcActivity {
  id: string;
  applicationId: string;
  applicationVersion: string;
  sessionId: string;
  authorization: string;
  csrfToken?: { headerName: string, headerValue: string };
}

/** Notification callback for an RPC invocation.
 * @public
 */
export type RpcInvocationCallback = (invocation: RpcInvocation) => void;

/** An RPC operation invocation in response to a request.
 * @public
 */
export class RpcInvocation {
  public static currentActivity: RpcActivity;
  private _threw: boolean = false;
  private _pending: boolean = false;
  private _notFound: boolean = false;
  private _noContent: boolean = false;
  private _timeIn: number = 0;
  private _timeOut: number = 0;

  /** The protocol for this invocation. */
  public readonly protocol: RpcProtocol;

  /** The received request. */
  public readonly request: SerializedRpcRequest;

  /** The operation of the request. */
  public readonly operation: RpcOperation = undefined as any;

  /** The implementation response. */
  public readonly result: Promise<any>;

  /** The fulfillment for this request. */
  public readonly fulfillment: Promise<RpcRequestFulfillment>;

  /** The status for this request. */
  public get status(): RpcRequestStatus {
    if (this._threw) {
      return RpcRequestStatus.Rejected;
    } else {
      if (this._pending)
        return RpcRequestStatus.Pending;
      else if (this._notFound)
        return RpcRequestStatus.NotFound;
      else if (this._noContent)
        return RpcRequestStatus.NoContent;
      else
        return RpcRequestStatus.Resolved;
    }
  }

  /** The elapsed time for this invocation. */
  public get elapsed(): number {
    return this._timeOut - this._timeIn;
  }

  /**
   * The invocation for the current RPC operation.
   * @note The return value of this function is only reliable in an RPC impl class member function where program control was received from the RpcInvocation constructor function.
   */
  public static current(rpcImpl: RpcInterface): RpcInvocation {
    return (rpcImpl as any)[CURRENT_INVOCATION];
  }

  /** Constructs an invocation. */
  public constructor(protocol: RpcProtocol, request: SerializedRpcRequest) {
    this._timeIn = new Date().getTime();
    this.protocol = protocol;
    this.request = request;

    try {
      try {
        this.operation = RpcOperation.lookup(this.request.operation.interfaceDefinition, this.request.operation.operationName);

        const backend = this.operation.interfaceVersion;
        const frontend = this.request.operation.interfaceVersion;
        if (!RpcInterface.isVersionCompatible(backend, frontend)) {
          throw new IModelError(RpcInterfaceStatus.IncompatibleVersion, `Backend version ${backend} does not match frontend version ${frontend} for RPC interface ${this.operation.operationName}.`);
        }
      } catch (error) {
        if (this.handleUnknownOperation(error)) {
          this.operation = RpcOperation.lookup(this.request.operation.interfaceDefinition, this.request.operation.operationName);
        } else {
          throw error;
        }
      }

      this.operation.policy.invocationCallback(this);
      this.result = this.resolve();
    } catch (error) {
      this.result = this.reject(error);
    }

    this.fulfillment = this.result.then(async (value) => this._threw ? this.fulfillRejected(value) : this.fulfillResolved(value), async (reason) => this.fulfillRejected(reason));
  }

  private handleUnknownOperation(error: any): boolean {
    return this.protocol.configuration.controlChannel.handleUnknownOperation(this, error);
  }

  /** When processing an RPC request that throws an unhandled exception, log it with sanitized requestContext.
   * @internal
   */
  public static logRpcException(activity: RpcActivity, operationName: string, error: unknown) {
    const props = {
      error: getErrorProps(error),
      activity: {
        activityId: activity.activityId,
        sessionId: activity.sessionId,
        app: activity.applicationId,
        version: activity.applicationVersion,
      },
    };

    Logger.logError(CommonLoggerCategory.RpcInterfaceBackend, `Error in RPC operation [${operationName}]`, () => props);
  }

  private async resolve(): Promise<any> {
    let activity: RpcActivity | undefined;
    try {
      activity = RpcConfiguration.requestContext.deserialize(this.request);
      this.protocol.events.raiseEvent(RpcProtocolEvent.RequestReceived, this);

      const parameters = RpcMarshaling.deserialize(this.protocol, this.request.parameters);
      this.applyPolicies(parameters);
      const impl = RpcRegistry.instance.getImplForInterface(this.operation.interfaceDefinition);
      (impl as any)[CURRENT_INVOCATION] = this;
      const op = this.lookupOperationFunction(impl);

      // This global is a "pseudo-magic-argument" to every RPC call. RpcImplementations must pass it as an argument to
      // any asynchronous code that may need it, and *not* rely on the global variable remaining unchanged across async calls.
      RpcInvocation.currentActivity = activity;

      return await op.call(impl, ...parameters);
    } catch (error: unknown) {
      if (activity)
        RpcInvocation.logRpcException(activity, this.request.operation.operationName, error);

      return this.reject(error);
    }
  }

  private applyPolicies(parameters: any) {
    if (!parameters || !Array.isArray(parameters)) {
      return;
    }

    for (let i = 0; i !== parameters.length; ++i) {
      const parameter = parameters[i];
      const isToken = typeof (parameter) === "object" && parameter !== null && parameter.hasOwnProperty("iModelId") && parameter.hasOwnProperty("iTwinId");
      if (isToken && this.protocol.checkToken && !this.operation.policy.allowTokenMismatch) {
        const inflated = this.protocol.inflateToken(parameter, this.request);
        parameters[i] = inflated;

        if (!RpcInvocation.compareTokens(parameter, inflated)) {
          if (RpcConfiguration.throwOnTokenMismatch) {
            throw new IModelError(BentleyStatus.ERROR, "IModelRpcProps mismatch detected for this request.");
          } else {
            Logger.logWarning(CommonLoggerCategory.RpcInterfaceBackend, "IModelRpcProps mismatch detected for this request.");
          }
        }
      }
    }
  }

  private static compareTokens(a: IModelRpcProps, b: IModelRpcProps): boolean {
    return a.key === b.key &&
      a.iTwinId === b.iTwinId &&
      a.iModelId === b.iModelId &&
      (undefined === a.changeset || (a.changeset.id === b.changeset?.id));
  }

  private async reject(error: any): Promise<any> {
    this._threw = true;
    return error;
  }

  private async fulfillResolved(value: any): Promise<RpcRequestFulfillment> {
    this._timeOut = new Date().getTime();
    this.protocol.events.raiseEvent(RpcProtocolEvent.BackendResponseCreated, this);
    const result = await RpcMarshaling.serialize(this.protocol, value);
    return this.fulfill(result, value);
  }

  private async fulfillRejected(reason: any): Promise<RpcRequestFulfillment> {
    this._timeOut = new Date().getTime();
    if (!RpcConfiguration.developmentMode)
      reason.stack = undefined;

    const result = await RpcMarshaling.serialize(this.protocol, reason);

    let isNoContentError = false;
    try { isNoContentError = reason.errorNumber === IModelStatus.NoContent; } catch { }

    if (reason instanceof RpcPendingResponse) {
      this._pending = true;
      this._threw = false;
      result.objects = reason.message;
      this.protocol.events.raiseEvent(RpcProtocolEvent.BackendReportedPending, this);
    } else if (this.supportsNoContent() && isNoContentError) {
      this._noContent = true;
      this._threw = false;
      this.protocol.events.raiseEvent(RpcProtocolEvent.BackendReportedNoContent, this);
    } else if (reason instanceof RpcNotFoundResponse) {
      this._notFound = true;
      this._threw = false;
      this.protocol.events.raiseEvent(RpcProtocolEvent.BackendReportedNotFound, this);
    } else {
      this._threw = true;
      this.protocol.events.raiseEvent(RpcProtocolEvent.BackendErrorOccurred, this);
    }

    return this.fulfill(result, reason);
  }

  private supportsNoContent() {
    if (!this.request.protocolVersion) {
      return false;
    }

    return RpcProtocol.protocolVersion >= 1 && this.request.protocolVersion >= 1;
  }

  private fulfill(result: RpcSerializedValue, rawResult: any): RpcRequestFulfillment {
    const fulfillment: RpcRequestFulfillment = {
      result,
      rawResult,
      status: this.protocol.getCode(this.status),
      id: this.request.id,
      interfaceName: (typeof (this.operation) === "undefined") ? "" : this.operation.interfaceDefinition.interfaceName,
    };

    try {
      const impl = RpcRegistry.instance.getImplForInterface(this.operation.interfaceDefinition) as any;
      if (impl[CURRENT_INVOCATION] === this) {
        impl[CURRENT_INVOCATION] = undefined;
      }
    } catch (_err) { }

    return fulfillment;
  }

  private lookupOperationFunction(implementation: RpcInterface): (...args: any[]) => Promise<any> {
    const func = (implementation as any)[this.operation.operationName];
    if (!func || typeof (func) !== "function")
      throw new IModelError(BentleyStatus.ERROR, `RPC interface class "${implementation.constructor.name}" does not implement operation "${this.operation.operationName}".`);

    return func;
  }
}
