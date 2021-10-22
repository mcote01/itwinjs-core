/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Workspace
 */

import * as fs from "fs-extra";
import { dirname, extname, join } from "path";
import { AccessToken, DbResult, GuidString, OpenMode } from "@itwin/core-bentley";
import { SQLiteDb } from "../SQLiteDb";
import { IModelJsFs } from "../IModelJsFs";
import { IModelHost } from "../IModelHost";
import { IModelError, LocalFileName } from "@itwin/core-common";
import { createHash } from "crypto";
import { SqliteStatement } from "../SqliteStatement";

export type WorkspaceResourceName = string;
export type WorkspaceResourceType = "string" | "blob" | "file";

/**
 * A container of workspace resources. `WorkspaceContainer`s may just be local files, or they may be
 * stored and synchronized with cloud blob-store containers.
 * WorkspaceContainers hold WorkspaceResources, each identified by a [[WorkspaceResourceName]] and a [[WorkspaceResourceType]].
 * Resources of type `string` and `blob` may be loaded directly from a `WorkspaceContainer`. Resources of type `file` are
 * copied from the container into a temporary local file so they can be accessed directly.
 */
export interface WorkspaceContainer {
  /** The name of this container. This remains unchanged as the container itself is versioned.
   * @note containerNames must be less than 255 characters and may not have any reserved characters (see https://github.com/sindresorhus/filename-reserved-regex)
   */
  readonly containerName: string;
  /** The id of this container.
   * @note This identifies the container in cloud storage. If this is a local container, it is just the container name.
   * For cloud-backed containers, the same `containerName` may refer to different `containerId`s as the container is versioned over time.
   */
  readonly containerId: string;

  /** Get a string resource from this container, if present. */
  getString: (resourceName: WorkspaceResourceName) => string | undefined;

  /** Get a blob resource from this container, if present. */
  getBlob: (resourceName: WorkspaceResourceName) => Uint8Array | undefined;

  /** Get a local copy of a file resource from this container, if present.
   * @returns the full path to a file on the local filesystem.
   * @note The file is copied from the container into the local filesystem so it may be accessed directly. This happens only
   * as necessary, if the local file doesn't exist, or if it is out-of-date because it was updated in the container.
   * For this reason, you should not save the local file name, and instead call this method every time you open it, so its
   * content is always holds the correct version.
   * @note The filename will be a hash value, not the resource name.
   * @note Workspace resource files are set readonly after they are copied from the container.
   * To edit them, you must first copy them to another location.
   */
  getFile: (resourceName: WorkspaceResourceName) => LocalFileName | undefined;
}

/**
 * An editable [[WorkspaceContainer]]. This interface is used by administrators for creating and modifying `WorkspaceContainer`s.
 * For cloud-backed containers, the write token must be obtained before this interface may be used. Only one user at at time
 * may be editing.
 */
export interface EditableWorkspaceContainer extends WorkspaceContainer {
  addString: (resourceName: WorkspaceResourceName, val: string) => void;
  updateString: (resourceName: WorkspaceResourceName, val: string) => void;
  removeString: (resourceName: WorkspaceResourceName) => void;

  addBlob: (resourceName: WorkspaceResourceName, val: Uint8Array) => void;
  updateBlob: (resourceName: WorkspaceResourceName, val: Uint8Array) => void;
  removeBlob: (resourceName: WorkspaceResourceName) => void;

  addFile: (resourceName: WorkspaceResourceName, localFileName: LocalFileName) => void;
  updateFile: (resourceName: WorkspaceResourceName, localFileName: LocalFileName) => void;
  removeFile: (resourceName: WorkspaceResourceName) => void;
}

export class WorkspaceFile implements EditableWorkspaceContainer {
  private static maxNameLength = 2000;
  private static maxBlobLength = Math.pow(1024, 3); // one gigabyte
  private readonly db = new SQLiteDb(); // eslint-disable-line @typescript-eslint/naming-convention

  public readonly containerName: string;
  public readonly containerId: GuidString;
  public getContainerDir() { return join(IModelHost.workspaceRoot, this.containerName); }
  public getContainerFilesDir() { return join(this.getContainerDir(), "Files"); }

  private getLocalDbName() { return join(this.getContainerDir(), `${this.containerId}.wsdb`); }
  private getLocalFilesDir() { return join(this.getContainerFilesDir(), this.containerId); }
  private queryFileResource(resourceName: WorkspaceResourceName) {
    const info = this.db.nativeDb.queryEmbeddedFile(resourceName);
    if (undefined === info)
      return undefined;

    // since resource names can contain illegal characters, path separators, etc., we make the local file name from its hash.
    let localFileName = join(this.getLocalFilesDir(), createHash("md5").update(resourceName).digest("hex"));
    if (info.fileExt !== "") // since some applications may expect to see the extension, append it here if it was supplied.
      localFileName = `${localFileName}.${info.fileExt}`;
    return { localFileName, info };
  }
  private get isOpen() { return this.db.isOpen; } // eslint-disable-line @typescript-eslint/naming-convention
  private get isOpenForWrite() { return this.isOpen && !this.db.nativeDb.isReadonly(); } // eslint-disable-line @typescript-eslint/naming-convention
  private mustBeWriteable() {
    if (!this.isOpenForWrite)
      throw new Error("workspace not open for write");
  }
  private getLocalFileTime(localFileName: LocalFileName): number {
    const stat = fs.statSync(localFileName);
    if (undefined === stat)
      throw new Error("local file not found");
    return stat.mtimeMs;
  }
  private static validateContainerName(name: string) {
    const reservedRegex = /[<>:"/\\|?*\u0000-\u001F]/g; // see https://github.com/sindresorhus/filename-reserved-regex
    const windowsRegex = /^(con|prn|aux|nul|com\d|lpt\d)$/i;
    if (name.length > 255 || reservedRegex.test(name) || windowsRegex.test(name))
      throw new Error("invalid container name");
  }
  private validateResourceName(resourceName: WorkspaceResourceName) {
    if (resourceName === "")
      throw new Error("resource name cannot be blank");
    if (resourceName.length > WorkspaceFile.maxNameLength)
      throw new Error("`resource name is too long");
    // check for illegal characters
  }
  private validateBlob(val: Uint8Array) {
    if (val.byteLength > WorkspaceFile.maxBlobLength)
      throw new Error("blob is too large");
  }
  private validateString(val: string) {
    if (val.length > WorkspaceFile.maxBlobLength)
      throw new Error("string is too large");
  }
  public constructor(containerName: string, containerId?: GuidString) {
    WorkspaceFile.validateContainerName(containerName);
    this.containerName = containerName;
    this.containerId = containerId ?? "0";
  }

  public async attach(_token: AccessToken) {
  }

  public async download() {
  }

  public async upload() {
  }

  public purgeLocalFiles() {
    IModelJsFs.purgeDirSync(this.getLocalFilesDir());
  }
  public create() {
    const localFileName = this.getLocalDbName();
    IModelJsFs.recursiveMkDirSync(dirname(localFileName));
    this.db.createDb(localFileName);
    this.db.executeSQL("CREATE TABLE strings(id TEXT PRIMARY KEY NOT NULL,value TEXT)");
    this.db.executeSQL("CREATE TABLE blobs(id TEXT PRIMARY KEY NOT NULL,value BLOB)");
    this.db.saveChanges();
  }

  public open(args: { accessToken?: AccessToken, openMode?: OpenMode }) {
    this.db.openDb(this.getLocalDbName(), args.openMode ?? OpenMode.Readonly);
  }

  public getString(resourceName: WorkspaceResourceName): string | undefined {
    return this.db.withSqliteStatement("SELECT value from strings WHERE id=?", (stmt) => {
      stmt.bindString(1, resourceName);
      return DbResult.BE_SQLITE_ROW === stmt.step() ? stmt.getValueString(0) : undefined;
    });
  }

  public getBlob(resourceName: WorkspaceResourceName): Uint8Array | undefined {
    return this.db.withSqliteStatement("SELECT value from blobs WHERE id=?", (stmt) => {
      stmt.bindString(1, resourceName);
      return DbResult.BE_SQLITE_ROW === stmt.step() ? stmt.getValueBlob(0) : undefined;
    });
  }

  public getFile(resourceName: WorkspaceResourceName): LocalFileName | undefined {
    const file = this.queryFileResource(resourceName);
    if (!file)
      return undefined;

    const { localFileName, info } = file;
    const stat = fs.existsSync(localFileName) && fs.lstatSync(localFileName);
    if (stat && Math.trunc(stat.mtimeMs) === info.date && stat.size === info.size)
      return localFileName;

    // check whether the file is already up to date.
    if (stat)
      fs.removeSync(localFileName);
    else
      IModelJsFs.recursiveMkDirSync(dirname(localFileName));

    this.db.nativeDb.extractEmbeddedFile({ name: resourceName, localFileName });
    const date = new Date(info.date);
    fs.utimesSync(localFileName, date, date); // set the last-modified date of the file
    fs.chmodSync(localFileName, 4); // set file readonly
    return localFileName;
  }

  private performWriteSql(resourceName: WorkspaceResourceName, sql: string, bind?: (stmt: SqliteStatement) => void) {
    this.mustBeWriteable();
    this.db.withSqliteStatement(sql, (stmt) => {
      stmt.bindString(1, resourceName);
      bind?.(stmt);
      const rc = stmt.step();
      if (DbResult.BE_SQLITE_DONE !== rc)
        throw new IModelError(rc, "workspace write error");
    });
    this.db.saveChanges();

  }
  public addString(resourceName: WorkspaceResourceName, val: string) {
    this.validateString(val);
    this.performWriteSql(resourceName, "INSERT INTO strings(id,value) VALUES(?,?)", (stmt) => stmt.bindString(2, val));
  }

  public updateString(resourceName: WorkspaceResourceName, val: string) {
    this.validateString(val);
    this.performWriteSql(resourceName, "UPDATE strings SET value=?2 WHERE id=?1", (stmt) => stmt.bindString(2, val));
  }

  public removeString(resourceName: WorkspaceResourceName) {
    this.performWriteSql(resourceName, "DELETE FROM strings WHERE id=?");
  }

  public addBlob(resourceName: WorkspaceResourceName, val: Uint8Array) {
    this.validateResourceName(resourceName);
    this.validateBlob(val);
    this.performWriteSql(resourceName, "INSERT INTO blobs(id,value) VALUES(?,?)", (stmt) => stmt.bindBlob(2, val));
  }

  public updateBlob(resourceName: WorkspaceResourceName, val: Uint8Array) {
    this.validateBlob(val);
    this.performWriteSql(resourceName, "UPDATE blobs SET value=?2 WHERE id=?1", (stmt) => stmt.bindBlob(2, val));
  }

  public removeBlob(resourceName: WorkspaceResourceName) {
    this.performWriteSql(resourceName, "DELETE FROM blobs WHERE id=?");
  }

  public addFile(resourceName: WorkspaceResourceName, localFileName: LocalFileName, fileExt?: string): void {
    this.validateResourceName(resourceName);
    this.mustBeWriteable();
    fileExt = fileExt ?? extname(localFileName);
    if (fileExt?.[0] === ".")
      fileExt = fileExt.slice(1);
    this.db.nativeDb.embedFile({ name: resourceName, localFileName, date: this.getLocalFileTime(localFileName), fileExt });
  }

  public updateFile(resourceName: WorkspaceResourceName, localFileName: LocalFileName): void {
    this.mustBeWriteable();
    this.queryFileResource(resourceName); // throws if not present
    this.db.nativeDb.replaceEmbeddedFile({ name: resourceName, localFileName, date: this.getLocalFileTime(localFileName) });
  }

  public removeFile(resourceName: WorkspaceResourceName) {
    this.mustBeWriteable();
    const file = this.queryFileResource(resourceName);
    if (file && fs.existsSync(file.localFileName))
      fs.unlinkSync(file.localFileName);
    this.db.nativeDb.removeEmbeddedFile(resourceName);
  }
}
