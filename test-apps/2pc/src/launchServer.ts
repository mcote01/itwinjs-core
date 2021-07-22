/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { ChildProcess, spawn, SpawnOptions, StdioOptions } from "child_process";
import * as net from "net";
import * as path from "path";

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

export async function getServerAddress(): Promise<string> {
  // IP address that the backend will use to bind the gRPC server.
  const port = await getFreeTcpPort();
  return `localhost:${port}`;
}

/** Launches the specified reader.x process and creates a client to communciate with it. */
export async function launchServer(exePath: string, args: string[], childEnv?: NodeJS.ProcessEnv): Promise<ChildProcess> {
  const stdio: StdioOptions = ["ipc", "pipe", "pipe"];
  const spawnOptions: SpawnOptions = { stdio, env: childEnv || process.env };
  const childProcess = spawn(exePath, args, spawnOptions);
  childProcess.stdout.on("data", (data: any) => process.stdout.write(data));
  childProcess.stderr.on("data", (data: any) => process.stderr.write(data));
  return childProcess;
}

export async function launchPythonSever(readerPyFile: string, rpcServerAddress: string): Promise<ChildProcess> {
  const generatePbDir = path.join(__dirname, "../../src/generated");
  const childEnv = { ...process.env };
  childEnv.PYTHONPATH = generatePbDir;
  return launchServer("python", [readerPyFile, rpcServerAddress], childEnv);
}
