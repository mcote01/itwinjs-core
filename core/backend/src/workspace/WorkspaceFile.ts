/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Workspace
 */

import { SQLiteDb } from "../SQLiteDb";

export class WorkspaceFile {
  public readonly fileName: string;
  protected readonly lockDb = new SQLiteDb();

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  public create() {
    this.lockDb.createDb(this.fileName);
    this.lockDb.executeSQL("CREATE TABLE resources(id TEXT PRIMARY KEY NOT NULL,type TEXT,value BLOB)");
    this.lockDb.saveChanges();
  }

  public open() {

  }
}