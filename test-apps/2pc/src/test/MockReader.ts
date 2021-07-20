/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* eslint-disable no-console */
/*
  Pretend to be Reader.x.
  Run a gRPC server that implements the Reader service.
*/
import * as grpc from "@grpc/grpc-js";
import { TestRequest, TestResponse } from "../generated/reader_pb";
import { IReaderServer, ReaderService } from "../generated/reader_grpc_pb";

const readerServer: IReaderServer = {
  sww(call: grpc.ServerWritableStream<TestRequest, TestResponse>) {
    const response = new TestResponse();
    response.setTestResponse("hello");
    call.write(response);
  },

};

function getServer(): grpc.Server {
  const server = new grpc.Server();
  server.addService(ReaderService, readerServer);
  return server;
}

export async function startMockReader(rpcServerAddress: string): Promise<void> {
  const server = getServer();
  return new Promise((resolve, reject) => {
    server.bindAsync(
      rpcServerAddress,
      grpc.ServerCredentials.createInsecure(),
      (err: Error | null, port: number) => {
        if (err) {
          reject(err);
        } else {
          console.log(`Server bound on port: ${port}`);
          server.start();
          resolve();
        }
      }
    );
  });
}

