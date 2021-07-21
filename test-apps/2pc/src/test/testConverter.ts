/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { assert } from "chai";
import { ReaderClient } from "../generated/reader_grpc_pb";
import { PingRequest, PingResponse, ShutdownRequest, ShutdownResponse, TestRequest, TestResponse } from "../generated/reader_pb";

export async function doServerStreamingCall(client: ReaderClient): Promise<void> {
  const clientMessage = new TestRequest();
  clientMessage.setTestMessage("Message from client");
  const stream = client.sww(clientMessage);
  let i = 0;
  return new Promise((resolve, reject) => {
    stream.on("data", (_response: TestResponse) => {
      ++i;
    });
    stream.on("error", (err: Error) => {
      reject(err);
    });
    stream.on("end", () => {
      // eslint-disable-next-line no-console
      console.log(`(client) stream has ended. ${i} responses`);
      resolve();
    });
  });
}

export async function doShutdownCall(client: ReaderClient): Promise<ShutdownResponse> {
  const shutdownRequest = new ShutdownRequest();
  shutdownRequest.setOptions("");
  return new Promise((resolve, reject) => {
    client.shutdown(shutdownRequest, (err, response) => {
      if (err)
        reject(err);
      resolve(response);
    });
  });
}

export async function doPingCall(client: ReaderClient): Promise<PingResponse> {
  const pingRequest = new PingRequest();
  return new Promise((resolve, reject) => {
    client.ping(pingRequest, (err, response) => {
      if (err)
        reject(err);
      resolve(response);
    });
  });
}

export async function doPingCallWithRetries(client: ReaderClient, retryCount?: number): Promise<PingResponse> {
  if (retryCount === undefined)
    retryCount = 3;
  for (let i = 0; i < retryCount; ++i) {
    try {
      return await doPingCall(client);
    } catch (err) {
      if (err.code === 12) // this means that the server did not implement the "ping" method
        throw new Error("the server does not implement the 'ping' method!");
      if (i === retryCount - 1)
        throw err;
    }
  }
  assert.isTrue(false, "we should never get here");
  throw new Error("");
}
