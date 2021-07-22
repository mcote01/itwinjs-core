/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/*
  Pretend to be Reader.x.
  Run a gRPC server that implements the Reader service.
*/
import * as grpc from "@grpc/grpc-js";
import * as path from "path";
import * as fs from "fs";
import * as sax from "sax";
import { PingRequest, PingResponse, ShutdownRequest, ShutdownResponse, GetDataRequest, GetDataResponse } from "../generated/reader_pb";
import { IReaderServer, ReaderService } from "../generated/reader_grpc_pb";

let server: grpc.Server;

/*
  Mock implementation of Reader server
*/
let sourcePath: string;

function writeTile(call: grpc.ServerWritableStream<GetDataRequest, GetDataResponse>, shape: string, tile: any) {
  tile.objType = "Tile";
  tile.tileType = shape;
  const response = new GetDataResponse();
  response.setTestResponse(JSON.stringify(tile));
  call.write(response);
}

const readerServer: IReaderServer = {
  ping(_call: grpc.ServerUnaryCall<PingRequest, PingResponse>, callback: grpc.sendUnaryData<PingResponse>) {
    const response = new PingResponse();
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
      response.setTestResponse(JSON.stringify({ objType: "Error", details: err.message }));
      call.write(response);
      call.end();
    }

    // deliberately fail to write groups (or maybe return them out of order)

    for (const shape of Object.keys(data.Tiles)) {
      if (Array.isArray(data.Tiles[shape])) {
        for (const tile of data.Tiles[shape]) {
          writeTile(call, shape, tile);
        }
      } else {
        writeTile(call, shape, data.Tiles[shape]);
      }
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
export async function startMockTypescriptReader(rpcServerAddress: string, _sourcePath: string): Promise<void> {
  server = new grpc.Server();
  server.addService(ReaderService, readerServer);

  sourcePath = _sourcePath;

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

