/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { assert } from "chai";
import * as path from "path";
import { BentleyLoggerCategory, DbResult, Id64, Id64String, Logger, LogLevel } from "@bentley/bentleyjs-core";
import {
  BackendLoggerCategory, ECSqlStatement, ExternalSourceAspect, IModelDb, IModelJsFs, NativeLoggerCategory,
  PhysicalPartition, Subject,
} from "@bentley/imodeljs-backend";
import { IModel } from "@bentley/imodeljs-common";
import { ITwinClientLoggerCategory } from "@bentley/itwin-client";
import { CodeSpecs, RectangleTile, SmallSquareTile } from "./ToyTile/ToyTileElements";
import { ModelNames } from "./ToyTile/ToyTile2PConnector";
import { BridgeLoggerCategory } from "../../BridgeLoggerCategory";

function getCount(imodel: IModelDb, className: string) {
  let count = 0;
  imodel.withPreparedStatement(`SELECT count(*) AS [count] FROM ${className}`, (stmt: ECSqlStatement) => {
    assert.equal(DbResult.BE_SQLITE_ROW, stmt.step());
    const row = stmt.getRow();
    count = row.count;
  });
  return count;
}

export class BridgeTestUtils {
  public static setupLogging() {
    Logger.initializeToConsole();
    Logger.setLevelDefault(LogLevel.Info);

    if (process.env.imjs_test_logging_config === undefined) {
      // eslint-disable-next-line no-console
      console.log(`You can set the environment variable imjs_test_logging_config to point to a logging configuration json file.`);
    }
    const loggingConfigFile: string = process.env.imjs_test_logging_config || path.join(__dirname, "logging.config.json");

    if (IModelJsFs.existsSync(loggingConfigFile)) {
      // eslint-disable-next-line no-console
      console.log(`Setting up logging levels from ${loggingConfigFile}`);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      Logger.configureLevels(require(loggingConfigFile));
    }
  }

  private static initDebugLogLevels(reset?: boolean) {
    Logger.setLevelDefault(reset ? LogLevel.Error : LogLevel.Warning);
    Logger.setLevel(BentleyLoggerCategory.Performance, reset ? LogLevel.Error : LogLevel.Info);
    Logger.setLevel(BackendLoggerCategory.IModelDb, reset ? LogLevel.Error : LogLevel.Trace);
    Logger.setLevel(BridgeLoggerCategory.Framework, reset ? LogLevel.Error : LogLevel.Trace);
    Logger.setLevel(ITwinClientLoggerCategory.Clients, reset ? LogLevel.Error : LogLevel.Warning);
    // Logger.setLevel(IModelHubClientLoggerCategory.IModelHub, reset ? LogLevel.Error : LogLevel.Warning);
    Logger.setLevel(ITwinClientLoggerCategory.Request, reset ? LogLevel.Error : LogLevel.Warning);
    Logger.setLevel(NativeLoggerCategory.DgnCore, reset ? LogLevel.Error : LogLevel.Warning);
    Logger.setLevel(NativeLoggerCategory.BeSQLite, reset ? LogLevel.Error : LogLevel.Warning);
    Logger.setLevel(NativeLoggerCategory.Licensing, reset ? LogLevel.Error : LogLevel.Warning);
    Logger.setLevel("Base2PConnector", reset ? LogLevel.Error : LogLevel.Trace);
    Logger.setLevel("ToyTile2Pconnector", reset ? LogLevel.Error : LogLevel.Trace);
  }

  // Setup typical programmatic log level overrides here
  // Convenience method used to debug specific tests/fixtures
  public static setupDebugLogLevels() {
    BridgeTestUtils.initDebugLogLevels(false);
  }

  public static resetDebugLogLevels() {
    BridgeTestUtils.initDebugLogLevels(true);
  }

  public static verifyIModel(imodel: IModelDb, sourcePath: string, isUpdate: boolean = false) {
    // Confirm the schema was imported simply by trying to get the meta data for one of the classes.
    assert.isDefined(imodel.getMetaData("ToyTile:ToyTileGroup"));
    assert.equal(1, getCount(imodel, "BisCore:RepositoryLink"));
    assert.equal(1, getCount(imodel, "BisCore:PhysicalModel"));
    assert.equal(1, getCount(imodel, "ToyTile:ToyTileGroupModel"));
    assert.equal(8, getCount(imodel, "BisCore:GeometryPart"));
    assert.equal(1, getCount(imodel, "BisCore:SpatialCategory"));
    assert.equal(2, getCount(imodel, "BisCore:RenderMaterial"));
    assert.equal(2, getCount(imodel, "ToyTile:ToyTileGroup"));
    assert.equal(41, getCount(imodel, "ToyTile:ToyTilePhysicalElement"));
    assert.equal(6, getCount(imodel, "ToyTile:EquilateralTriangleTile"));
    assert.equal(8, getCount(imodel, "ToyTile:IsoscelesTriangleTile"));
    assert.equal(isUpdate ? 7 : 8, getCount(imodel, "ToyTile:LargeSquareTile"));
    assert.equal(isUpdate ? 2 : 1, getCount(imodel, "ToyTile:RectangleTile"));
    assert.equal(10, getCount(imodel, "ToyTile:RightTriangleTile"));
    assert.equal(8, getCount(imodel, "ToyTile:SmallSquareTile"));

    assert.isTrue(imodel.codeSpecs.hasName(CodeSpecs.Group));
    const jobSubjectName = `ToyTile2PConnector:${sourcePath}`;
    const subjectId: Id64String = imodel.elements.queryElementIdByCode(Subject.createCode(imodel, IModel.rootSubjectId, jobSubjectName))!;
    assert.isTrue(Id64.isValidId64(subjectId));

    const physicalModelId = imodel.elements.queryElementIdByCode(PhysicalPartition.createCode(imodel, subjectId, ModelNames.Physical));
    assert.isTrue(physicalModelId !== undefined);
    assert.isTrue(Id64.isValidId64(physicalModelId!));

    // Verify some elements
    if (!isUpdate) {
      const ids = ExternalSourceAspect.findBySource(imodel, physicalModelId!, "Tile", "e1aa3ec3-0c2e-4328-89d0-08e1b4d446c8");
      assert.isTrue(Id64.isValidId64(ids.aspectId!));
      assert.isTrue(Id64.isValidId64(ids.elementId!));
      const tile = imodel.elements.getElement<SmallSquareTile>(ids.elementId!);
      assert.equal(tile.condition, "New");
    } else {
      // Modified element
      let ids = ExternalSourceAspect.findBySource(imodel, physicalModelId!, "Tile", "e1aa3ec3-0c2e-4328-89d0-08e1b4d446c8");
      assert.isTrue(Id64.isValidId64(ids.aspectId!));
      assert.isTrue(Id64.isValidId64(ids.elementId!));
      let tile = imodel.elements.getElement<SmallSquareTile>(ids.elementId!);
      assert.equal(tile.condition, "Scratched");

      // New element
      ids = ExternalSourceAspect.findBySource(imodel, physicalModelId!, "Tile", "5b51a06f-4026-4d0d-9674-d8428b118e9a");
      assert.isTrue(Id64.isValidId64(ids.aspectId!));
      assert.isTrue(Id64.isValidId64(ids.elementId!));
      tile = imodel.elements.getElement<RectangleTile>(ids.elementId!);
      assert.equal(tile.placement.origin.x, 1.0);
      assert.equal(tile.placement.origin.y, 2.0);
    }
  }
}
