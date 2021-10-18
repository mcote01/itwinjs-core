/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Settings
 */

import { BeEvent, JSONSchema, Mutable } from "@itwin/core-bentley";

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
  private static readonly _allGroups = new Map<string, SettingsGroupSpec>();
  public static readonly allSpecs = new Map<string, SettingSpec>();
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

  public static unregister(groupName: string[]): void {
    const properties = this.doDeregister(groupName);
    this.onSpecsChanged.raiseEvent();
    this.onSettingsUpdated.raiseEvent(properties);
  }

  public static update({ add, remove }: { add: SettingsGroupSpec[], remove: string[] }): void {
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
      this._allGroups.set(group.groupName, group);
    });
    return properties;
  }

  private static doDeregister(groupNames: string[]): string[] {
    const properties: string[] = [];
    const deregisterGroup = (groupName: string) => {
      const group = this._allGroups.get(groupName);
      if (undefined !== group)
        for (const base of Object.keys(group.properties)) {
          const key = `${group.groupName}.${base}`;
          properties.push(key);
          this.allSpecs.delete(key);
        }
    };
    for (const groupName of groupNames) {
      deregisterGroup(groupName);
      this._allGroups.delete(groupName);
    }
    return properties;
  }

  private static validateProperty(property: string): string | undefined {
    if (!property.trim())
      return "empty property name";
    if (this.allSpecs.has(property))
      return `property "${property}" is already defined`;

    return undefined;
  }

  private static validateAndRegister(group: SettingsGroupSpec, problems?: string[]): string[] {
    const keys: string[] = [];
    const properties = group.properties;
    for (const base of Object.keys(properties)) {
      const key = `${group.groupName}.${base}`;
      const problem = this.validateProperty(key);
      if (problem) {
        problems?.push(problem);
        delete properties[key];
        continue;
      }

      const property: Mutable<SettingSpec> = properties[base];
      property.default = property.default ?? this.getDefaultValue(property.type);
      this.allSpecs.set(key, property);
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
