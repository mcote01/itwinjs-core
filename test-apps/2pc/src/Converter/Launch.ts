/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as grpc from "@grpc/grpc-js";
import { spawn, SpawnOptions } from "child_process";
import * as net from "net";
import * as path from "path";
import { ReaderClient } from "../generated/reader_grpc_pb";

/** Describes a spawned clash detection server */
export interface ReaderClientWithShutdown {
  /** Created constraint solver gRPC service. Use this to communicate with the server. */
  service: ReaderClient;
  /** Closes the backend. */
  shutdown(): void;
}

export async function getServerAddress(): Promise<string> {
  // IP address that the backend will use to bind the gRPC server.
  const port = await getFreeTcpPort();
  return `localhost:${port}`;
}

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

// NEEDS WORK: This same logic probably exists in many places -- find and use a standard, shared implementation
async function getFreeTcpPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer((socket) => {
      socket.end();
    });

    // Binding to port 0 is a special case that makes the OS assign a random free port.
    server.listen(0, () => {
      const address = server.address();
      let port: number | undefined;

      if (address && typeof address === "object") {
        port = address.port;
      }

      server.close(() => {
        if (port === undefined) {
          reject("Could not get a free TCP port.");
          return;
        }
        resolve(port);
      });
    });
  });
}

/** Launches the specified reader.x process and creates a client to communciate with it. */
export async function launchServerAndCreateClient(exePath: string, rpcServerAddress: string): Promise<ReaderClientWithShutdown> {

  // Inherit stdout and stderr to see output of the process.
  const spawnOptions: SpawnOptions = { stdio: [undefined, "inherit", "inherit"], env: process.env };

  // Spawn the Reader.exe
  const backend = spawn(path.join(exePath), [rpcServerAddress], spawnOptions);

  // Create a ReaderService.
  const service = await createClient(rpcServerAddress);

  return {
    service,
    shutdown: () => {
      // TODO: we should gracefully shutdown by sending a "shutdown" request
      backend.kill();
    },
  };
}
