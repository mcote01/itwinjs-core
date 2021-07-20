/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/*
  Pretend to be Reader.x.
  Run a gRPC server that implements the Reader service.
*/
import * as grpc from "@grpc/grpc-js";
import { ShutdownRequest, ShutdownResponse, TestRequest, TestResponse } from "../generated/reader_pb";
import { IReaderServer, ReaderService} from "../generated/reader_grpc_pb";

let server: grpc.Server;

const readerServer: IReaderServer = {
  sww(call: grpc.ServerWritableStream<TestRequest, TestResponse>) {
    const response = new TestResponse();
    response.setTestResponse("hello");
    call.write(response);
  },

  shutdown(_call: grpc.ServerUnaryCall<ShutdownRequest, ShutdownResponse>, callback: grpc.sendUnaryData<ShutdownResponse>) {
    const response = new ShutdownResponse();
    response.setStatus("0");
    server.tryShutdown((err?: Error) => {
      if (err)
        response.setStatus(err.message);
      callback(null, response);
    });
  },

};

function getServer(): grpc.Server {
  server = new grpc.Server();
  server.addService(ReaderService, readerServer);
  return server;
}

export async function startMockReader(rpcServerAddress: string): Promise<void> {
  server = getServer();
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

