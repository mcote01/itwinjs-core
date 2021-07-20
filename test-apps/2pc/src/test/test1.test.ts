/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// import { assert } from "chai";
// import * as grpc from "@grpc/grpc-js";
import { createClient, getServerAddress } from "../Converter/Launch";
import { ReaderClient } from "../generated/reader_grpc_pb";
import { TestRequest, TestResponse } from "../generated/reader_pb";
import { startMockReader } from "./MockReader";

export function doServerStreamingCall(client: ReaderClient) {
  const clientMessage = new TestRequest();
  clientMessage.setTestMessage("Message from client");
  const stream = client.sww(clientMessage);
  stream.on("data", (response: TestResponse) => {
    // eslint-disable-next-line no-console
    console.log(
      `(client) Got server message: ${response.getTestResponse()}`
    );
  });
}

describe("test1", async () => {
  it("test1", async () => {
    const rpcServerAddress = await getServerAddress();
    await startMockReader(rpcServerAddress);
    const client = await createClient(rpcServerAddress);
    doServerStreamingCall(client);
  });
});

