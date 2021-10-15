/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Settings
 */

import { BeEvent, JSONSchema, Mutable } from "@itwin/core-bentley";

/** A JavaScript object that acts a dictionary. */
export type StringDictionary<V> = Record<string, V>;

export interface SettingSpec extends Readonly<JSONSchema> {
  readonly enumItemLabels?: string[];
  readonly multilineEdit?: true;
}

export interface SettingsGroupSpec {
  readonly groupName: string;
  readonly order?: number;
  readonly title?: string;
  readonly description?: string;
  readonly properties: { [name: string]: SettingSpec };
  readonly extensionId?: string;
}

/** used for editing Settings files and finding default values. */
export class SettingsSpecRegistry {
  private constructor() { } // singleton
  public static readonly allGroups: StringDictionary<SettingsGroupSpec> = {};
  public static readonly allSpecs: StringDictionary<SettingSpec> = {};
  public static readonly onSpecsChanged = new BeEvent<() => void>();
  public static readonly onSettingsUpdated = new BeEvent<(properties: string[]) => void>();

  public static register(settingsGroup: SettingsGroupSpec | SettingsGroupSpec[]): string[] {
    if (!Array.isArray(settingsGroup))
      settingsGroup = [settingsGroup];

    const problems: string[] = [];
    const properties = this.doRegister(settingsGroup, problems);
    this.onSpecsChanged.raiseEvent();
    this.onSettingsUpdated.raiseEvent(properties);
    return problems;
  }

  public static unregister(settingsGroup: SettingsGroupSpec[]): void {
    const properties = this.doDeregister(settingsGroup);
    this.onSpecsChanged.raiseEvent();
    this.onSettingsUpdated.raiseEvent(properties);
  }

  public static update({ add, remove }: { add: SettingsGroupSpec[], remove: SettingsGroupSpec[] }): void {
    const properties = new Set<string>();
    this.doDeregister(remove).forEach((setting) => properties.add(setting));
    this.doRegister(add).forEach((setting) => properties.add(setting));

    this.onSpecsChanged.raiseEvent();
    this.onSettingsUpdated.raiseEvent(Array.from(properties));
  }

  private static doRegister(settingsGroup: SettingsGroupSpec[], problems?: string[]): string[] {
    const properties: string[] = [];
    settingsGroup.forEach((group) => {
      properties.push(...this.validateAndRegister(group, problems)); // fills in defaults
      this.allGroups[group.groupName] = group;
    });
    return properties;
  }

  private static doDeregister(groups: SettingsGroupSpec[]): string[] {
    const properties: string[] = [];
    const deregisterGroup = (group: SettingsGroupSpec) => {
      for (const key of Object.keys(group.properties)) {
        properties.push(key);
        delete this.allSpecs.key;
      }
    };
    for (const group of groups) {
      deregisterGroup(group);
      delete this.allGroups[group.groupName];
    }
    return properties;
  }

  private static validateProperty(property: string): string | undefined {
    if (!property.trim())
      return "empty property name";
    if (undefined !== this.allSpecs[property])
      return `property "${property}" is already defined`;

    return undefined;
  }

  private static validateAndRegister(group: SettingsGroupSpec, problems?: string[]): string[] {
    const keys: string[] = [];
    const properties = group.properties;
    for (const key of Object.keys(properties)) {
      const problem = this.validateProperty(key);
      if (problem) {
        problems?.push(problem);
        delete properties[key];
        continue;
      }

      const property: Mutable<SettingSpec> = properties[key];
      property.default = property.default ?? this.getDefaultValue(property.type);
      this.allSpecs[key] = properties[key];
      keys.push(key);
    }
    return keys;
  }

  private static getDefaultValue(type: string | string[] | undefined): any {
    const t = Array.isArray(type) ? (type)[0] : type;
    switch (t) {
      case "boolean":
        return false;
      case "integer":
      case "number":
        return 0;
      case "string":
        return "";
      case "array":
        return [];
      case "object":
        return {};
      default:
        return undefined;
    }
  }
}
