/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/*
  Run a gRPC server that implements the Reader service.
*/
import * as grpc from "@grpc/grpc-js";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as fs from "fs";
import { GetDataRequest, GetDataResponse, InitializeRequest, InitializeResponse, OnBriefcaseServerAvailableParams, ShutdownRequest } from "../../generated/reader_pb";
import { IReaderServer, ReaderService } from "../../generated/reader_grpc_pb";
import { BriefcaseClient } from "../../generated/briefcase_grpc_pb";
import * as briefcase_pb from "../../generated/briefcase_pb";
import { Id64String } from "../../../../bentley/lib/Id";

let server: grpc.Server;
let briefcaseClient: BriefcaseClient;

/*
  Client to make calls running the other way: from this server to the connector
*/
function createBriefcaseClient(address: string): void {

  const client = new BriefcaseClient(address, grpc.credentials.createInsecure());

  const timeout = 5000;
  const deadline = new Date().getTime() + timeout;

  client.waitForReady(deadline, (error) => {
    if (error)
      throw error;
    briefcaseClient = client;
  });
}

/*
  Mock implementation of Reader server
*/
let sourcePath: string;

async function findElement(guid: string): Promise<Id64String | undefined> {
  if (briefcaseClient === undefined)
    return undefined;

  const existing: briefcase_pb.TryGetElementPropsResult = await new Promise((resolve, reject) => {
    // const request = new briefcase_pb.DetectChangeRequest();
    // const identifier = new briefcase_pb.ExternalSourceAspectIdentifier();
    // identifier.setKind("Element");
    // identifier.setScopeid("0");
    // identifier.setIdentifier(data.guid);
    // request.setIdentifier(identifier);
    // const state = new
    // briefcaseClient.detectChange()
    const request = new briefcase_pb.TryGetElementPropsRequest();
    request.setFederationguid(guid);
    briefcaseClient.tryGetElementProps(request, (err, response) => {
      if (err)
        reject(err);
      resolve(response);
    });
  });

  const json = existing.getPropsjson();
  return existing.hasId64()? existing.getId64(): undefined;
}


function writeTile(call: grpc.ServerWritableStream<GetDataRequest, GetDataResponse>, shape: string, data: any): void {
  data.objType = "Tile";
  data.tileType = shape;
  const response = new GetDataResponse();
  response.setData(JSON.stringify(data));
  call.write(response);
}

function writeGroup(call: grpc.ServerWritableStream<GetDataRequest, GetDataResponse>, data: any): void {
  data.objType = "Group";
  const response = new GetDataResponse();
  response.setData(JSON.stringify(data));
  call.write(response);
}

function initialize(call: grpc.ServerUnaryCall<InitializeRequest, InitializeResponse>, callback: grpc.sendUnaryData<InitializeResponse>): void {
  sourcePath = call.request.getFilename();
  const response = new InitializeResponse();
  callback(null, response);
}

function onBriefcaseServerAvailable(call: grpc.ServerUnaryCall<OnBriefcaseServerAvailableParams, google_protobuf_empty_pb.Empty>, callback: grpc.sendUnaryData<google_protobuf_empty_pb.Empty>): void {
  const bcserveraddr = call.request.getAddress();
  callback(null, new google_protobuf_empty_pb.Empty());
  createBriefcaseClient(bcserveraddr);
}

async function getData(call: grpc.ServerWritableStream<GetDataRequest, GetDataResponse>): Promise<void> {
  let data: any;
  try {
    const json = fs.readFileSync(sourcePath, "utf8");
    data = JSON.parse(json);
  } catch (err) {
    const response = new GetDataResponse();
    response.setData(JSON.stringify({ objType: "Error", details: err.message }));
    call.write(response);
    call.end();
  }

  for (const shape of Object.keys(data.Tiles)) {
    if (Array.isArray(data.Tiles[shape])) {
      for (const tile of data.Tiles[shape]) {
        const exist = await findElement(tile.guid);
        if (exist !== undefined) {
          console.log(`Tile already found in iModel. TODO - check to see if it is changed. To do that, I'd have to know how to compute its hash.`);
        }
        writeTile(call, shape, tile);
      }
    } else {
      writeTile(call, shape, data.Tiles[shape]);
    }
  }

  // deliberately return groups after tiles (which reference groups) to show that the client subclass must be ready for this

  for (const i of Object.keys(data.Groups)) {
    writeGroup(call, data.Groups[i]);
  }

  call.end();
}

function shutdown(_call: grpc.ServerUnaryCall<ShutdownRequest, google_protobuf_empty_pb.Empty>, callback: grpc.sendUnaryData<google_protobuf_empty_pb.Empty>): void {
  callback(null, new google_protobuf_empty_pb.Empty());
  server.tryShutdown((err?: Error) => {
    if (err)
      // eslint-disable-next-line no-console
      console.log(err.message);
  });
}

// For testing purposes, we can run the server in the same process as the client.
// It will use the same gRPC stack as an out-of-process server, but it's simpler to debug.
export async function startMockTypescriptReader(rpcServerAddress: string): Promise<void> {
  server = new grpc.Server();
  server.addService(ReaderService, { initialize, onBriefcaseServerAvailable, getData, shutdown });

  return new Promise((resolve, reject) => {
    server.bindAsync(
      rpcServerAddress,
      grpc.ServerCredentials.createInsecure(),
      (err: Error | null, _port: number) => {
        if (err) {
          reject(err);
        } else {
          server.start();
          resolve();
        }
      }
    );
  });
}
