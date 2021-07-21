/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as grpc from "@grpc/grpc-js";
import { ReaderClient } from "../generated/reader_grpc_pb";

/** Creates a Reader.x client
 * @note Server must be started before creating a service.
 * @note This function will wait for a server to bind to the specified `address`.
 */

export async function createClient(address: string): Promise<ReaderClient> {

  const client = new ReaderClient(address, grpc.credentials.createInsecure());

  const timeout = 5000;
  const deadline = new Date().getTime() + timeout;

  await new Promise<void>((resolve, reject) => {
    client.waitForReady(deadline, (error) => { error ? reject(error) : resolve(); });
  });

  return client;
}
