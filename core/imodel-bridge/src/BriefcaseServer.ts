/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { ECSqlStatement, ExternalSourceAspect, SqliteStatement } from "@bentley/imodeljs-backend";
import { Code, DbResult, ElementLoadProps, IModelError, IModelStatus } from "@bentley/imodeljs-common";
import { IModelBridge } from "./IModelBridge";
import { ItemState, SourceItem } from "./Synchronizer";

import * as grpc from "@grpc/grpc-js";
import { BriefcaseService, IBriefcaseServer } from "./generated/briefcase_grpc_pb";
import * as briefcase_pb from "./generated/briefcase_pb";

let connector: IModelBridge; // NEEDS WORK - don't use global

function addLimitOffset(ecsql: string, request: briefcase_pb.ExecuteECSqlRequest): string {
  const limit = request.getLimit();
  if (limit !== undefined && limit !== null && limit > 0)
    ecsql = `${ecsql} limit ${limit}`;

  const offset = request.getOffset();
  if (offset !== undefined && offset !== null && offset > 0)
    ecsql = `${ecsql} offset ${offset}`;

  return ecsql;
}

function bindParams(stmt: ECSqlStatement | SqliteStatement, request: briefcase_pb.ExecuteECSqlRequest): void {
  const params = request.getParams();
  if (params !== undefined && params !== "")
    stmt.bindValues(JSON.parse(params));
}

function executeECSql(call: grpc.ServerUnaryCall<briefcase_pb.ExecuteECSqlRequest, briefcase_pb.ExecuteECSqlResult>, callback: grpc.sendUnaryData<briefcase_pb.ExecuteECSqlResult>) {
  const req = call.request;
  let ecsql = req.getEcsqlstatement();
  if (ecsql === "")
    throw new IModelError(IModelStatus.BadArg, "No ECSQL statement provided");

  ecsql = addLimitOffset(ecsql, req);

  let errorResult: DbResult = DbResult.BE_SQLITE_DONE;
  const rows: any[] = [];
  connector.synchronizer.imodel.withPreparedStatement(ecsql, (stmt: ECSqlStatement) => {
    bindParams(stmt, req);

    let dbresult: DbResult;
    while ((dbresult = stmt.step()) === DbResult.BE_SQLITE_ROW)
      rows.push(stmt.getRow());

    if (dbresult !== DbResult.BE_SQLITE_DONE)
      errorResult = dbresult;
  });

  const response = new briefcase_pb.ExecuteECSqlResult();
  response.setStatus(errorResult);
  response.setRowsjson(JSON.stringify(rows));
  callback(null, response);
}

function tryGetElementProps(call: grpc.ServerUnaryCall<briefcase_pb.TryGetElementPropsRequest, briefcase_pb.TryGetElementPropsResult>, callback: grpc.sendUnaryData<briefcase_pb.TryGetElementPropsResult>) {
  const params: ElementLoadProps = {};

  if (call.request.hasFederationguid()) {
    params.federationGuid = call.request.getFederationguid();
  } else if (call.request.hasId64()) {
    params.id = call.request.getId64();
  } else if (call.request.hasCode()) {
    const codeSpec = connector.synchronizer.imodel.codeSpecs.getByName(call.request.getCode()!.getSpec());
    const scope = call.request.getCode()!.getScope();
    const value = call.request.getCode()!.getValue();
    params.code = new Code({ spec: codeSpec.id, scope, value });
  } else if (call.request.hasExternalsourceaspectidentifier()) {
    const scopeId = call.request.getExternalsourceaspectidentifier()!.getScopeid();
    const identifier = call.request.getExternalsourceaspectidentifier()!.getIdentifier();
    const kind = call.request.getExternalsourceaspectidentifier()!.getKind();
    const { elementId } = ExternalSourceAspect.findBySource(connector.synchronizer.imodel, scopeId, kind, identifier);
    if (elementId === undefined) {
      callback(null, new briefcase_pb.TryGetElementPropsResult());
      return;
    }
    params.id = elementId;
  }

  params.wantBRepData = false;  // Never return binary data to an external reader. It cannot parse it.
  params.wantGeometry = false;  //            "                       "

  const response = new briefcase_pb.TryGetElementPropsResult();

  const props = connector.synchronizer.imodel.elements.tryGetElementProps(params);
  if (props === undefined || props.id === undefined) {
    callback(null, response);
    return;
  }
  response.setPropsjson(JSON.stringify(props));
  callback(null, response);
}

function getExternalSourceAspectProps(call: grpc.ServerUnaryCall<briefcase_pb.GetExternalSourceAspectPropsRequest, briefcase_pb.ExternalSourceAspectProps>, callback: grpc.sendUnaryData<briefcase_pb.ExternalSourceAspectProps>) {
  const aspectId = call.request.getExternalsourceaspectid();
  const response = new briefcase_pb.ExternalSourceAspectProps();
  if (aspectId === undefined) {
    callback(null, response);
    return;
  }
  const xsa = connector.synchronizer.imodel.elements.getAspect(aspectId) as ExternalSourceAspect;
  const aspectIdentifier = new briefcase_pb.ExternalSourceAspectIdentifier();
  response.setElementid(xsa.element.id);
  aspectIdentifier.setKind(xsa.kind);
  aspectIdentifier.setScopeid(xsa.scope.id);
  aspectIdentifier.setIdentifier(xsa.identifier);
  response.setIdentifier(aspectIdentifier);
  const sourceState = new briefcase_pb.ExternalSourceState();
  if (xsa.checksum) sourceState.setChecksum(xsa.checksum);
  if (xsa.version) sourceState.setVersion(xsa.version);
  response.setState(sourceState);
  if (xsa.source) response.setSource(xsa.source.id);
  if (xsa.jsonProperties) response.setJsonproperties(xsa.jsonProperties);
  callback(null, response);
}

function detectChange(call: grpc.ServerUnaryCall<briefcase_pb.DetectChangeRequest, briefcase_pb.DetectChangeResult>, callback: grpc.sendUnaryData<briefcase_pb.DetectChangeResult>) {
  const response = new briefcase_pb.DetectChangeResult();
  if (!call.request.hasIdentifier() || !call.request.hasState()) {
    callback(null, response);
    return;
  }
  const identifier = call.request.getIdentifier()!;
  const scope = identifier.getScopeid();
  const kind = identifier.getKind();
  const state = call.request.getState()!;
  const sourceItem: SourceItem = { id: identifier.getIdentifier(), version: state.getVersion(), checksum: state.getChecksum() };
  const changeDetectionResult = connector.synchronizer.detectChanges(scope, kind, sourceItem);
  if (changeDetectionResult.id === undefined) {
    callback(null, response);
    return;
  }
  response.setElementid(changeDetectionResult.id);
  response.setIschanged(changeDetectionResult.state === ItemState.Changed);

  const { aspectId } = ExternalSourceAspect.findBySource(connector.synchronizer.imodel, scope, kind, identifier.getIdentifier());
  if (aspectId !== undefined) response.setExternalsourceaspectid(aspectId);
  callback(null, response);
}

export async function startBriefcaseGrpcServer(rpcServerAddress: string, connectorIn: IModelBridge): Promise<grpc.Server> {
  const server = new grpc.Server();
  connector = connectorIn; // NEEDS WORK - don't use global
  const briefcaseServer: IBriefcaseServer = { executeECSql, tryGetElementProps, getExternalSourceAspectProps, detectChange };
  server.addService(BriefcaseService, briefcaseServer);

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

