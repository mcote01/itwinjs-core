/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import {
  IModelDb,
  ExternalSourceAspect,
} from "@bentley/imodeljs-backend";
import {
  Code,
  ElementLoadProps,
} from "@bentley/imodeljs-common";

import * as grpc from "@grpc/grpc-js";
import { BriefcaseService, IBriefcaseServer } from "./generated/briefcase_grpc_pb";
import * as briefcase_pb from "./generated/briefcase_pb";

let briefcaseForBriefcaseServer: IModelDb; // NEEDS WORK - don't use global

function makeXsaResponse(aspectId: string | undefined): briefcase_pb.ExternalSourceAspectProps {
  const response = new briefcase_pb.ExternalSourceAspectProps();
  if (aspectId === undefined) {
    return response;
  }
  const xsa = briefcaseForBriefcaseServer.elements.getAspect(aspectId) as ExternalSourceAspect;
  response.setKind(xsa.kind);
  response.setScopeid(xsa.scope.id);
  response.setIdentifier(xsa.identifier);
  response.setElement(xsa.element.id);
  if (xsa.source) response.setSource(xsa.source.id);
  if (xsa.jsonProperties) response.setJsonproperties(xsa.jsonProperties);
  if (xsa.checksum) response.setChecksum(xsa.checksum);
  if (xsa.version) response.setVersion(xsa.version);
  return response;
}

const _briefcaseServer: IBriefcaseServer = {
  tryGetElementProps(call: grpc.ServerUnaryCall<briefcase_pb.TryGetElementPropsRequest, briefcase_pb.ElementProps>, callback: grpc.sendUnaryData<briefcase_pb.ElementProps>) {
    let params: ElementLoadProps = {};

    if (call.request.hasFederationguid()) {
      params.federationGuid = call.request.getFederationguid();
    } else if (call.request.hasId64()) {
      params.id = call.request.getId64();
    } else if (call.request.hasCode()) {
      const codeSpec = briefcaseForBriefcaseServer.codeSpecs.getByName(call.request.getCode()!.getSpec());
      const scope = call.request.getCode()!.getScope();
      const value = call.request.getCode()!.getValue();
      params.code = new Code({ spec: codeSpec.id, scope: scope, value });
    } else if (call.request.hasExternalsourceaspect()) {
      const scopeId = call.request.getExternalsourceaspect()!.getScopeid();
      const identifier = call.request.getExternalsourceaspect()!.getIdentifier();
      const kind = call.request.getExternalsourceaspect()!.getKind();
      const { elementId, aspectId } = ExternalSourceAspect.findBySource(briefcaseForBriefcaseServer, scopeId, kind, identifier);
      if (elementId === undefined) {
        callback(null, new briefcase_pb.ElementProps());
        return;
      }
      params.id = elementId;
    }

    if (call.request.hasElementloadoptions()) {
      const loadOptions = call.request.getElementloadoptions()!;
      if (loadOptions.hasWantbrepdata())
        params.wantBRepData = loadOptions.getWantbrepdata()!;
      if (loadOptions.hasWantgeometry())
        params.wantGeometry = loadOptions.getWantgeometry()!;
      // TODO:displayStyle,renderTimeline
    }

    const response = new briefcase_pb.ElementProps();

    const props = briefcaseForBriefcaseServer.elements.tryGetElementProps(params);
    if (props === undefined) {
      callback(null, response);
      return;
    }

    response.setPropsjson(JSON.stringify(props)); // TODO: map element properties onto finely typed return object
  },

  getExternalSourceAspectProps(call: grpc.ServerUnaryCall<briefcase_pb.ExternalSourceAspectIdentifier, briefcase_pb.ExternalSourceAspectProps>, callback: grpc.sendUnaryData<briefcase_pb.ExternalSourceAspectProps>) {
    const identifier = call.request.getIdentifier();
    const kind = call.request.getKind();
    const scope = call.request.getScopeid();
    const { elementId, aspectId } = ExternalSourceAspect.findBySource(briefcaseForBriefcaseServer, scope, kind, identifier);
    callback(null, makeXsaResponse(aspectId))
    return;
  }

};

export async function startBriefcaseGrpcServer(rpcServerAddress: string, briefcase: IModelDb): Promise<grpc.Server> {
  const server = new grpc.Server();
  briefcaseForBriefcaseServer = briefcase; // NEEDS WORK - don't use global
  server.addService(BriefcaseService, _briefcaseServer);

  return new Promise((resolve, reject) => {
    server.bindAsync(
      rpcServerAddress,
      grpc.ServerCredentials.createInsecure(),
      (err: Error | null, _port: number) => {
        if (err) {
          reject(err);
        } else {
          server.start();
          resolve(server);
        }
      }
    );
  });
}

