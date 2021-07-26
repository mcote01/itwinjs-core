/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { assert, ClientRequestContext, Id64String, IModelStatus, Logger } from "@bentley/bentleyjs-core";
import { AuthorizedClientRequestContext } from "@bentley/itwin-client";
import {
  CategorySelector, DisplayStyle3d, DisplayStyleCreationOptions, IModelDb, IModelJsFs,
  ModelSelector, OrthographicViewDefinition, RepositoryLink, SpatialCategory,
} from "@bentley/imodeljs-backend";
import {
  ColorByName, ColorDef, IModelError, RenderMode, ViewFlags,
} from "@bentley/imodeljs-common";
import { StandardViewIndex } from "@bentley/geometry-core";

import * as grpc from "@grpc/grpc-js";
import { ReaderClient } from "./generated/reader_grpc_pb";
import { GetDataRequest, GetDataResponse, InitializeRequest, InitializeResponse, ShutdownRequest } from "./generated/reader_pb";
import { getServerAddress } from "./launchServer";
import { ItemState, SourceItem, SynchronizationResults } from "./Synchronizer";
import { IModelBridge } from "./IModelBridge";

export abstract class Base2PConnector extends IModelBridge {
  protected _sourceFilenameState: ItemState = ItemState.New;
  protected _sourceFilename?: string;
  protected _repositoryLink?: RepositoryLink;
  protected _readerClient?: ReaderClient;

  // #region IPC

  protected async doShutdownCall(): Promise<void> {
    const shutdownRequest = new ShutdownRequest();
    shutdownRequest.setOptions("");
    return new Promise((resolve, reject) => {
      assert(this._readerClient !== undefined);
      this._readerClient.shutdown(shutdownRequest, (err, _response) => {
        // "Regarding the error itself, the message indicates that the server unexpectedly closed the stream before the client considered
        // it to be complete. The code 0 indicates that the server did consider the stream to be complete."
        // https://github.com/grpc/grpc-node/issues/1532#issuecomment-700599867
        // We get this when the python server calls server.stop and then returns the "empty" response. The gRPC client, evidentally,
        // tries to read the response (despite the fact that it's declared as empty!) and finds that the pipe has been closed.
        // Well, the server is gone, and that's what we want, so treat this as not an error.
        if (err && err.message !== "13 INTERNAL: Received RST_STREAM with code 0") {
          Logger.logException(this.loggerCategory, err);
          reject(err);
        }
        resolve();
      });
    });
  }

  protected async doInitializeCall(filename: string): Promise<InitializeResponse> {
    assert(this._readerClient !== undefined);
    const initializeRequest = new InitializeRequest();
    initializeRequest.setFilename(filename);
    return new Promise((resolve, reject) => {
      assert(this._readerClient !== undefined);
      this._readerClient.initialize(initializeRequest, (err, response) => {
        if (err)
          reject(err);
        resolve(response);
      });
    });
  }

  protected async doInitializeCallWithRetries(filename: string, retryCount?: number): Promise<InitializeResponse> {
    if (retryCount === undefined)
      retryCount = 3;
    for (let i = 0; i < retryCount; ++i) {
      try {
        return await this.doInitializeCall(filename);
      } catch (err) {
        if (err.code === 12) // this means that the server did not implement the "initialize" method
          throw new Error("the server does not implement the 'initialize' method!");
        if (i === retryCount - 1)
          throw err;
      }
    }
    throw new Error("cannot reach Reader.x process");
  }

  protected abstract startServer(addr: string): Promise<void>;

  private async createClient(address: string): Promise<ReaderClient> {

    const client = new ReaderClient(address, grpc.credentials.createInsecure());

    const timeout = 5000;
    const deadline = new Date().getTime() + timeout;

    await new Promise<void>((resolve, reject) => {
      client.waitForReady(deadline, (error) => { error ? reject(error) : resolve(); });
    });

    return client;
  }

  public async openSourceData(sourcePath: string): Promise<void> {
    this._sourceFilename = sourcePath;
    const documentStatus = this.getDocumentStatus(); // make sure the repository link is created now, while we are in the repository channel
    this._sourceFilenameState = documentStatus.itemState;
    this._repositoryLink = documentStatus.element;

    const rpcServerAddress = await getServerAddress();
    await this.startServer(rpcServerAddress);
    this._readerClient = await this.createClient(rpcServerAddress);
    await this.doInitializeCallWithRetries(this._sourceFilename);
  }

  protected async fetchExternalData(onSourceData: any): Promise<void> {
    assert(this._readerClient !== undefined);
    const clientMessage = new GetDataRequest();
    const stream = this._readerClient.getData(clientMessage);
    return new Promise((resolve, reject) => {
      stream.on("data", (response: GetDataResponse) => {
        onSourceData(response.getData());
      });
      stream.on("error", (err: Error) => {
        reject(err);
      });
      stream.on("end", () => {
        resolve();
      });
    });
  }

  // #endregion

  public initialize(_params: any) {
    // nothing to do here
  }

  public override async terminate(): Promise<void> {
    await this.doShutdownCall();
  }

  public get repositoryLink(): RepositoryLink {
    assert(this._repositoryLink !== undefined);
    return this._repositoryLink;
  }

  protected abstract get loggerCategory(): string;
  protected abstract get defaultCategory(): string;

  public async importDynamicSchema(_requestContext: AuthorizedClientRequestContext | ClientRequestContext): Promise<any> {
    // don't need to generate any schemas
  }

  protected getDocumentStatus(): SynchronizationResults {
    let timeStamp = Date.now();
    assert(this._sourceFilename !== undefined, "we should not be in this method if the source file has not yet been opened");
    try {
      const stat = IModelJsFs.lstatSync(this._sourceFilename); // will throw if this._sourceFilename names a file that does not exist. That would be a bug. Let it abort the job.
      if (undefined !== stat) {
        timeStamp = stat.mtimeMs;
      }
    } catch (err) {
      Logger.logException(this.loggerCategory, err);
      throw err;
    }

    const sourceItem: SourceItem = {
      id: this._sourceFilename,
      version: timeStamp.toString(),
    };
    const documentStatus = this.synchronizer.recordDocument(IModelDb.rootSubjectId, sourceItem);
    if (undefined === documentStatus) {
      const error = `Failed to retrieve a RepositoryLink for ${this._sourceFilename}`;
      throw new IModelError(IModelStatus.BadArg, error, Logger.logError, this.loggerCategory);
    }
    return documentStatus;
  }

}
