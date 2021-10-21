/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Workspace
 */

import * as fs from "fs-extra";
import { join } from "path";
import { AccessToken, DbResult, OpenMode } from "@itwin/core-bentley";
import { SQLiteDb } from "../SQLiteDb";
import { IModelJsFs } from "../IModelJsFs";
import { IModelHost } from "../IModelHost";

export class WorkspaceFile {
  public readonly workspaceName: string;
  public readonly id: string;
  protected readonly db = new SQLiteDb();

  constructor(workspaceName: string, workspaceId: string) {
    this.workspaceName = workspaceName;
    this.id = workspaceId;
  }

  public async attach() {
  }

  public async download() {
  }

  public async upload() {
  }

  private getDir() {
    return join(IModelHost.workspaceRoot, this.workspaceName);
  }
  private getLocalDbName() {
    return join(this.getDir(), `${this.id}.ws.db`);
  }
  private makeLocalFileName(resourceName: string) {
    const fullPath = join(this.getDir(), "Files", ...resourceName.split("/"));
    IModelJsFs.recursiveMkDirSync(fullPath);
    return fullPath;
  }

  public create() {
    this.db.createDb(this.getLocalDbName());
    this.db.executeSQL("CREATE TABLE resources(id TEXT PRIMARY KEY NOT NULL,type TEXT,value BLOB)");
    this.db.saveChanges();
  }

  public open(args: { accessToken?: AccessToken, openMode?: OpenMode }) {
    this.db.openDb(this.getLocalDbName(), args.openMode ?? OpenMode.Readonly);
  }

  public saveResource(resourceName: string, val: Uint8Array | string) {
    if (this.db.nativeDb.isReadonly())
      throw new Error("workspace not open for write");

    const isString = typeof val === "string";
    this.db.withSqliteStatement("INSERT OR REPLACE INTO resources(id,type,value) VALUES(?,?,?)", (stmt) => {
      stmt.bindString(1, resourceName);
      stmt.bindString(2, isString ? "string" : "blob");
      if (isString)
        stmt.bindString(3, val);
      else
        stmt.bindBlob(3, val);
      const rc = stmt.step();
      if (DbResult.BE_SQLITE_DONE !== rc)
        throw new Error("cannot add resource");
    });
    this.db.saveChanges();
  }

  public getStringResource(resourceName: string): string | undefined {
    return this.db.withSqliteStatement("SELECT value from resources WHERE id=? AND type=string", (stmt) => {
      stmt.bindString(1, resourceName);
      return DbResult.BE_SQLITE_ROW === stmt.step() ? stmt.getValueString(0) : undefined;
    });
  }

  public getBlobResource(resourceName: string): Uint8Array | undefined {
    return this.db.withSqliteStatement("SELECT value from resources WHERE id=? AND type=blob", (stmt) => {
      stmt.bindString(1, resourceName);
      return DbResult.BE_SQLITE_ROW === stmt.step() ? stmt.getValueBlob(0) : undefined;
    });
  }

  public addOrReplaceFile(resourceName: string, localFileName: string): void {
    const stat = fs.statSync(localFileName);
    if (undefined === stat)
      throw new Error("local file not found");

    const nativeDb = this.db.nativeDb;
    if (nativeDb.isReadonly())
      throw new Error("workspace not open for write");

    const embedArg = { name: resourceName, localFileName, date: stat.mtimeMs };
    if (nativeDb.queryEmbeddedFile(resourceName)) // returns undefined if not there
      nativeDb.replaceEmbeddedFile(embedArg);
    else
      nativeDb.embedFile(embedArg);
  }

  public getLocalFile(resourceName: string): string {
    const nativeDb = this.db.nativeDb;
    const info = nativeDb.queryEmbeddedFile(resourceName);
    if (undefined === info)
      throw new Error(`file ${resourceName} not found in workspace ${this.workspaceName}`);

    const localFileName = this.makeLocalFileName(resourceName);
    const stat = fs.lstatSync(localFileName);
    if (Math.trunc(stat.mtimeMs) !== info.date || stat.size !== info.size) { // check whether the file is already up to date.
      if (undefined !== stat.size)
        fs.removeSync(localFileName);
      nativeDb.extractEmbeddedFile({ name: resourceName, localFileName });
    }

    return localFileName;
  }
}
