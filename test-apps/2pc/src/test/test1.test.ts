/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as path from "path";
import { assert } from "chai";
import { ChildProcess, spawn, SpawnOptions, StdioOptions } from "child_process";
import { getServerAddress } from "../Converter/launchServer";
import { createClient } from "../Converter/ReaderClient";
import { doPingCallWithRetries, doServerStreamingCall, doShutdownCall } from "./testConverter";
import { startMockTypescriptReader } from "./MockReader";

const useRunningServer = false;
const usePython = true;
const useIpc = true;

async function startMockPythonReader(addr: string): Promise<ChildProcess> {
  const readerPyFile = path.join(__dirname, "../../src/test/MockReader.py");
  const generatePbDir = path.join(__dirname, "../../src/generated");
  const stdio: StdioOptions = (useIpc) ? ["ipc", "pipe", "pipe"] : "pipe";
  const childEnv = { ...process.env };
  childEnv.PYTHONPATH = generatePbDir;
  const spawnOptions: SpawnOptions = { stdio, env: childEnv };
  const childProcess = spawn(path.join("python"), [readerPyFile, addr], spawnOptions);
  childProcess.stdout.on("data", (data: any) => process.stdout.write(data));
  childProcess.stderr.on("data", (data: any) => process.stderr.write(data));
  return childProcess;
}

describe("test1", async () => {
  it("test1", async () => {
    let rpcServerAddress = await getServerAddress();

    if (!useRunningServer) {
      if (usePython)
        await startMockPythonReader(rpcServerAddress);
      else
        await startMockTypescriptReader(rpcServerAddress);
    } else {
      rpcServerAddress = "[::]:50051";
    }

    const client = await createClient(rpcServerAddress);

    try {
      await doPingCallWithRetries(client);
    } catch (err) {
      assert.isTrue(false, err.message);
    }

    await doServerStreamingCall(client);

    await doShutdownCall(client);
  });

});

