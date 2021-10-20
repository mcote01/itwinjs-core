/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Workspace
 */

import { AccessToken, OpenMode } from "@itwin/core-bentley";
import { SQLiteDb } from "../SQLiteDb";

export class WorkspaceFile {
  public readonly fileName: string;
  protected readonly db = new SQLiteDb();

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  public create() {
    this.db.createDb(this.fileName);
    this.db.executeSQL("CREATE TABLE resources(id TEXT PRIMARY KEY NOT NULL,type TEXT,value BLOB)");
    this.db.saveChanges();
  }

  public open(args: { accessToken?: AccessToken, openMode?: OpenMode }) {
    this.db.openDb(this.fileName, args.openMode ?? OpenMode.Readonly);
  }
}
