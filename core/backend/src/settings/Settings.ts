/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Settings
 */

import { SettingsSpecRegistry, StringDictionary } from "./SettingsSpecRegistry";

export class SettingsFileContent {
  public readonly fileName;
  public
}
export type SettingsDictionary = StringDictionary<any>;

export function getSetting<T>(settings: SettingsDictionary, settingPath: string[], defaultValue: T): T {
  const accessSetting = (dict: SettingsDictionary, path: string[]) => {
    let current = dict;
    for (const component of path) {
      if (typeof current !== "object")
        return undefined;
      current = current[component];
    }
    return current as T;
  };

  const result = accessSetting(settings, settingPath);
  return result === undefined ? defaultValue : result;
}

export function merge(base: any, add: any, overwrite: boolean): void {
  Object.keys(add).forEach((key) => {
    if (key !== "__proto__") {
      if (key in base) {
        if (typeof base[key] === "object" && typeof add[key] === "object") {
          merge(base[key], add[key], overwrite);
        } else if (overwrite) {
          base[key] = add[key];
        }
      } else {
        base[key] = add[key];
      }
    }
  });
}

export function removeFromDictionary(dict: SettingsDictionary, key: string): void {

  const doRemove = (settings: SettingsDictionary, segments: string[]) => {
    const first = segments.shift()!;
    if (segments.length === 0) {
      delete settings[first]; // Reached last segment
      return;
    }

    if (Object.keys(settings).indexOf(first) !== -1) {
      const value = settings[first];
      if (typeof value === "object" && !Array.isArray(value)) {
        doRemove(value, segments);
        if (Object.keys(value).length === 0) {
          delete settings[first];
        }
      }
    }
  };
  doRemove(dict, key.split("."));
}

export function addToDictionary(settings: SettingsDictionary, key: string, value: any, conflictReporter: (message: string) => void): void {
  const segments = key.split(".");
  const last = segments.pop()!;

  let curr = settings;
  for (let i = 0; i < segments.length; ++i) {
    const segment = segments[i];
    let obj = curr[segment];
    switch (typeof obj) {
      case "undefined":
        obj = curr[segment] = {};
        break;
      case "object":
        break;
      default:
        conflictReporter(`Ignoring ${key} as ${segments.slice(0, i + 1).join(".")} is ${JSON.stringify(obj)}`);
        return;
    }
    curr = obj;
  }

  if (typeof curr === "object") {
    try {
      curr[last] = value;
    } catch (e) {
      conflictReporter(`Ignoring ${key} as ${segments.join(".")} is ${JSON.stringify(curr)}`);
    }
  } else {
    conflictReporter(`Ignoring ${key} as ${segments.join(".")} is ${JSON.stringify(curr)}`);
  }
}

export function toDictionary(properties: { [qualifiedKey: string]: any }, conflictReporter: (message: string) => void): SettingsDictionary {
  const dict = {};
  for (const key of Object.keys(properties))
    addToDictionary(dict, key, properties[key], conflictReporter);

  return dict;
}

export function getDefaultValues(): SettingsDictionary {
  const specs = SettingsSpecRegistry.allSpecs;

  const dict: SettingsDictionary = {};
  for (const key of Object.keys(specs)) {
    // eslint-disable-next-line no-console
    addToDictionary(dict, key, specs[key].default, (message) => console.error(`Conflict in default settings: ${message}`));
  }

  return dict;
}
