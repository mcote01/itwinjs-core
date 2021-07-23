/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import {
  IModelHost, IModelHostConfiguration,
} from "@bentley/imodeljs-backend";
import { KnownTestLocations } from "../KnownTestLocations";

// function getCount(imodel: IModelDb, className: string) {
//   let count = 0;
//   imodel.withPreparedStatement(`SELECT count(*) AS [count] FROM ${className}`, (stmt: ECSqlStatement) => {
//     assert.equal(DbResult.BE_SQLITE_ROW, stmt.step());
//     const row = stmt.getRow();
//     count = row.count;
//   });
//   return count;
// }

export class StandaloneTestUtils {

  public static async startBackend(): Promise<void> {
    const config = new IModelHostConfiguration();
    config.concurrentQuery.concurrent = 4; // for test restrict this to two threads. Making closing connection faster
    config.cacheDir = KnownTestLocations.outputDir;
    await IModelHost.startup(config);
  }

  public static async shutdownBackend(): Promise<void> {
    await IModelHost.shutdown();
  }

}
