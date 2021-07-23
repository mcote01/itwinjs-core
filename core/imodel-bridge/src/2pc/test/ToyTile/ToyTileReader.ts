/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/*
  Pretend to be Reader.x.
  Run a gRPC server that implements the Reader service.
*/
import * as grpc from "@grpc/grpc-js";
import * as fs from "fs";
import { GetDataRequest, GetDataResponse, InitializeRequest, InitializeResponse, ShutdownRequest, ShutdownResponse } from "../../../../../../test-apps/2pc/src/generated/reader_pb";
import { IReaderServer, ReaderService } from "../../../../../../test-apps/2pc/src/generated/reader_grpc_pb";

let server: grpc.Server;

/*
  Mock implementation of Reader server
*/
let sourcePath: string;

function writeTile(call: grpc.ServerWritableStream<GetDataRequest, GetDataResponse>, shape: string, data: any) {
  data.objType = "Tile";
  data.tileType = shape;
  const response = new GetDataResponse();
  response.setData(JSON.stringify(data));
  call.write(response);
}

function writeGroup(call: grpc.ServerWritableStream<GetDataRequest, GetDataResponse>, data: any) {
  data.objType = "Group";
  const response = new GetDataResponse();
  response.setData(JSON.stringify(data));
  call.write(response);
}

const readerServer: IReaderServer = {
  initialize(call: grpc.ServerUnaryCall<InitializeRequest, InitializeResponse>, callback: grpc.sendUnaryData<InitializeResponse>) {
    sourcePath = call.request.getFilename();
    const response = new InitializeResponse();
    response.setStatus("0");
    callback(null, response);
  },

  getData(call: grpc.ServerWritableStream<GetDataRequest, GetDataResponse>) {

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
  },

  shutdown(_call: grpc.ServerUnaryCall<ShutdownRequest, ShutdownResponse>, callback: grpc.sendUnaryData<ShutdownResponse>) {
    const response = new ShutdownResponse();
    response.setStatus("0");
    callback(null, response);
    server.tryShutdown((err?: Error) => {
      if (err)
        // eslint-disable-next-line no-console
        console.log(err.message);
    });
  },

};

// For testing purposes, we can run the server in the same process as the client.
// It will use the same gRPC stack as an out-of-process server, but it's simpler to debug.
export async function startMockTypescriptReader(rpcServerAddress: string): Promise<void> {
  server = new grpc.Server();
  server.addService(ReaderService, readerServer);

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

