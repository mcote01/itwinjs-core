/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Settings
 */

import { BeEvent } from "@itwin/core-bentley";
import { SettingType, StringDictionary } from "./SettingsSpecRegistry";

export type SettingsDictionary = StringDictionary<SettingType>;

export enum SettingsPriority {
  default,
  organization,
  iTwin,
  iModel,
  user,
  memory,
}

export function deepClone<T extends SettingType>(obj: any): T {
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  const result = Array.isArray(obj) ? [] : {} as any;
  Object.keys(obj).forEach((key: string) => {
    const v = obj[key];
    if (v && typeof v === "object") {
      result[key] = deepClone(v);
    } else {
      result[key] = v;
    }
  });
  return result;
}

export class SettingsFile {
  public constructor(
    public readonly name: string,
    public readonly priority: SettingsPriority,
    public readonly settings: SettingsDictionary,
  ) { }

  public getSetting(settingName: string): SettingType | undefined {
    return this.settings[settingName];
  }
}

export class Settings {
  private _files: SettingsFile[] = [];
  public readonly onSettingsChanged = new BeEvent<() => void>();

  public addFile(file: SettingsFile) {
    for (let i = 0; i < this._files.length; ++i) {
      if (this._files[i].priority > file.priority) {
        this._files.splice(i, 0, file);
        return;
      }
    }
    this._files.push(file);
    this.onSettingsChanged.raiseEvent();
  }

  public dropFile(name: string, raiseEvent = true) {
    for (let i = 0; i < this._files.length; ++i) {
      if (this._files[i].name === name) {
        this._files.splice(i, 1);
        if (raiseEvent)
          this.onSettingsChanged.raiseEvent();
        return true;
      }
    }
    return false;
  }

  public replaceFile(file: SettingsFile) {
    this.dropFile(file.name, false);
    this.addFile(file);
  }

  public getSetting<T extends SettingType>(settingName: string, defaultValue?: T): T | undefined {
    for (const group of this._files) {
      const val = group.getSetting(settingName);
      if (val !== undefined)
        return deepClone<T>(val);
    }
    return defaultValue;
  }
}
