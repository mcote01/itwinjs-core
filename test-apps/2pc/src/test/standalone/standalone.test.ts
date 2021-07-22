/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";

import { IModelJsFs, SnapshotDb } from "@bentley/imodeljs-backend";
import { BentleyStatus } from "@bentley/bentleyjs-core";

import { BridgeTestUtils } from "../TestUtils";
import { KnownTestLocations } from "../KnownTestLocations";
import { BridgeJobDefArgs, BridgeRunner } from "@bentley/imodel-bridge";

import * as path from "path";
import * as fs from "fs";
import { StandaloneTestUtils } from "./utils";

describe.only("standalone", () => {
  before(async () => {
    BridgeTestUtils.setupLogging();
    BridgeTestUtils.setupDebugLogLevels();
    if (!IModelJsFs.existsSync(KnownTestLocations.outputDir))
      IModelJsFs.mkdirSync(KnownTestLocations.outputDir);
    await StandaloneTestUtils.startBackend();
  });

  after(async () => {
    await StandaloneTestUtils.shutdownBackend();
  });

  it.only("snapshot from toytile json data", async () => {
    const bridgeJobDef = new BridgeJobDefArgs();
    bridgeJobDef.sourcePath = path.join(KnownTestLocations.assetsDir, "Base2PConnector.json");
    bridgeJobDef.bridgeModule = path.join(__dirname, "../../TestiModelBridge.js");
    bridgeJobDef.outputDir = KnownTestLocations.outputDir;
    bridgeJobDef.isSnapshot = true;

    const runner = new BridgeRunner(bridgeJobDef);
    const status = await runner.synchronize();
    expect(status === BentleyStatus.SUCCESS);

    const filePath = path.join(KnownTestLocations.outputDir, "Base2PConnector.bim");
    const imodel = SnapshotDb.openFile(filePath);
    BridgeTestUtils.verifyIModel(imodel, filePath);
    imodel.close();
  });
});
