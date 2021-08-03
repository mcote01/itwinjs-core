/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { ChildProcess, spawn, SpawnOptions, StdioOptions } from "child_process";
import * as net from "net";
import * as path from "path";
import { Logger } from "@bentley/bentleyjs-core";

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

export async function getServerAddress(mustBeDynamic?: boolean): Promise<string> {
  if (process.env.test2pconnector_server_address !== undefined && !mustBeDynamic)
    return process.env.test2pconnector_server_address;

  const port = await getFreeTcpPort();
  return `localhost:${port}`;
}

/** Launches the specified reader.x process */
export async function launchServer(exePath: string, args: string[], childEnv?: NodeJS.ProcessEnv): Promise<ChildProcess> {
  Logger.logInfo("Base2PConnector", `launching server ${exePath} ${args.join(" ")}`);
  const stdio: StdioOptions = ["ipc", "pipe", "pipe"];
  const spawnOptions: SpawnOptions = { stdio, env: childEnv || process.env };
  const childProcess = spawn(exePath, args, spawnOptions);
  childProcess.stdout.on("data", (data: any) => {
    Logger.logInfo("Base2PConnector.Server", `${data.toString()}`);
  });
  childProcess.stderr.on("data", (data: any) => {
    Logger.logInfo("Base2PConnector.Server", `${data.toString()}`);
  });
  childProcess.on("close", (code, signal) => {
    Logger.logInfo("Base2PConnector", `server CLOSED with code=${code} signal=${signal}`);
  });
  childProcess.on("exit", (code, signal) => {
    Logger.logInfo("Base2PConnector", `server exited with code=${code} signal=${signal}`);
  });
  childProcess.on("error", (err) => {
    Logger.logException("Base2PConnector", err);
  });
  childProcess.on("message", (message) => {
    Logger.logInfo("Base2PConnector", `server MESSAGE with message=${message.toString()}`);
  });
  childProcess.on("disconnect", () => {
    Logger.logInfo("Base2PConnector", `server DISCONNECT`);
  });
  return childProcess;
}

export async function launchPythonSever(readerPyFile: string, rpcServerAddress: string): Promise<ChildProcess> {
  const generatePbDir = path.join(__dirname, "generated");
  const childEnv = { ...process.env };
  childEnv.PYTHONPATH = generatePbDir;
  return launchServer("python", [readerPyFile, rpcServerAddress], childEnv);
}
