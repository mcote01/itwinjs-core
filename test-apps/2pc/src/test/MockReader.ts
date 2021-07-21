/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/*
  Pretend to be Reader.x.
  Run a gRPC server that implements the Reader service.
*/
import * as grpc from "@grpc/grpc-js";
import { PingRequest, PingResponse, ShutdownRequest, ShutdownResponse, TestRequest, TestResponse } from "../generated/reader_pb";
import { IReaderServer, ReaderService } from "../generated/reader_grpc_pb";

let server: grpc.Server;

/*
  Mock implementation of Reader server
*/
const readerServer: IReaderServer = {
  ping(_call: grpc.ServerUnaryCall<PingRequest, PingResponse>, callback: grpc.sendUnaryData<PingResponse>) {
    const response = new PingResponse();
    response.setStatus("0");
    callback(null, response);
  },

  sww(call: grpc.ServerWritableStream<TestRequest, TestResponse>) {
    const response = new TestResponse();
    for (let i = 0; i < 1000; ++i) {
      response.setTestResponse(`part ${i}`);
      call.write(response);
    }
    response.setTestResponse("<done>");
    call.write(response);
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

