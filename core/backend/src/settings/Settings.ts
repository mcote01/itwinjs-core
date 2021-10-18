/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Settings
 */

import { BeEvent, JSONSchemaType } from "@itwin/core-bentley";
import { SettingsSpecRegistry } from "./SettingsSpecRegistry";

export type SettingType = JSONSchemaType;

export interface SettingDictionary {
  [name: string]: SettingType;
}

export enum SettingsPriority {
  organization = 1,
  iTwin = 2,
  iModel = 3,
  user = 4,
  memory = 5,
}

function deepClone<T extends SettingType>(obj: any): T {
  if (!obj || typeof obj !== "object")
    return obj;

  const result = Array.isArray(obj) ? [] : {} as any;
  Object.keys(obj).forEach((key: string) => {
    const val = obj[key];
    if (val && typeof val === "object") {
      result[key] = deepClone(val);
    } else {
      result[key] = val;
    }
  });
  return result;
}

class SettingsFile {
  public constructor(public readonly name: string, public readonly priority: SettingsPriority, public readonly settings: SettingDictionary) { }
  public getSetting(settingName: string): SettingType | undefined {
    return this.settings[settingName];
  }
}

export class Settings {
  private static _files: SettingsFile[] = [];
  private static _registryListener: () => void;
  public static readonly onSettingsChanged = new BeEvent<() => void>();

  public static reset() {
    if (!this._registryListener)
      this._registryListener = SettingsSpecRegistry.onSpecsChanged.addListener(() => this.updateDefaults());

    this._files = [];
    this.updateDefaults();
  }

  private static updateDefaults() {
    const defaults: SettingDictionary = {};
    for (const [specName, val] of SettingsSpecRegistry.allSpecs)
      defaults[specName] = val.default!;
    this.add("_default_", 0, defaults);
  }

  public static add(fileName: string, priority: SettingsPriority, settings: SettingDictionary) {
    this.drop(fileName, false); // make sure we don't have the same file twice
    const file = new SettingsFile(fileName, priority, settings);
    for (let i = 0; i < this._files.length; ++i) {
      if (this._files[i].priority <= file.priority) {
        this._files.splice(i, 0, file);
        return;
      }
    }
    this._files.push(file);
    this.onSettingsChanged.raiseEvent();
  }

  public static drop(fileName: string, raiseEvent = true) {
    for (let i = 0; i < this._files.length; ++i) {
      if (this._files[i].name === fileName) {
        this._files.splice(i, 1);
        if (raiseEvent)
          this.onSettingsChanged.raiseEvent();
        return true;
      }
    }
    return false;
  }

  public static getSetting<T extends SettingType>(settingName: string, defaultValue?: T): T | undefined {
    for (const file of this._files) {
      const val = file.getSetting(settingName);
      if (val !== undefined)
        return deepClone<T>(val);
    }
    return defaultValue;
  }
}
