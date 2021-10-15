/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Json
 */

import { BeEvent } from "@itwin/core-bentley";
import { JSONSchema } from "@itwin/core-common";

/**  A JavaScript object that acts a dictionary. The keys are strings. */
export type StringDictionary<V> = Record<string, V>;

export interface ConfigurationRegistry {
  /** Register one or more configurations */
  registerConfiguration(configurations: ConfigurationNode | ConfigurationNode[], validate?: boolean): void;

  /**  Deregister multiple configurations from the registry. */
  removeConfiguration(configurations: ConfigurationNode | ConfigurationNode[]): void;

  /** Event that fires whenever a configuration schema changes */
  readonly onSchemaChanged: BeEvent<() => void>;

  readonly onConfigurationUpdated: BeEvent<(properties: string[]) => void>;

  /** Returns all configuration nodes contributed to this registry. */
  getConfigurations(): ConfigurationNode[];

  /** Returns all configurations settings of all configuration nodes contributed to this registry.  */
  getConfigurationProperties(): { [qualifiedKey: string]: ConfigurationPropertySchema };
}

export interface ConfigurationPropertySchema extends JSONSchema {
  /** if false, then ignore this property in the current session */
  included?: false;

  enumItemLabels?: string[];

  /**  When specified,edit with multiline editor */
  multilineEdit?: true;
}

export interface ConfigurationNode {
  id?: string;
  order?: number;
  type?: string | string[];
  title?: string;
  description?: string;
  properties?: { [path: string]: ConfigurationPropertySchema };
  extensionId?: string;
}

/**
 * Removes duplicates from the given array. The optional keyFn allows to specify
 * how elements are checked for equality by returning an alternate value for each.
 */
export function distinct<T>(array: ReadonlyArray<T>, keyFn: (value: T) => any = (value) => value): T[] {
  const seen = new Set<any>();

  return array.filter((element) => {
    const key = keyFn(element);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export const allSettings: { properties: StringDictionary<ConfigurationPropertySchema> } = { properties: {} };

class ConfigurationRegistryImpl implements ConfigurationRegistry {
  private readonly _defaultValues: StringDictionary<any> = {};
  private readonly _configurationContributors: ConfigurationNode[] = [];
  private readonly _configurationProperties: { [qualifiedKey: string]: JSONSchema } = {};
  private readonly _excludedConfigurationProperties: { [qualifiedKey: string]: JSONSchema } = {};

  public readonly onSchemaChanged = new BeEvent<() => void>();
  public readonly onConfigurationUpdated = new BeEvent<(properties: string[]) => void>();

  public registerConfiguration(configurations: ConfigurationNode | ConfigurationNode[], validate: boolean = true): void {
    if (!Array.isArray(configurations))
      configurations = [configurations];

    const properties = this.doRegisterConfigurations(configurations, validate);

    this.onSchemaChanged.raiseEvent();
    this.onConfigurationUpdated.raiseEvent(properties);
  }

  public deregisterConfigurations(configurations: ConfigurationNode[]): void {
    const properties = this.doDeregisterConfigurations(configurations);

    this.onSchemaChanged.raiseEvent();
    this.onConfigurationUpdated.raiseEvent(properties);
  }

  public updateConfigurations({ add, remove }: { add: ConfigurationNode[], remove: ConfigurationNode[] }): void {
    const properties = [];
    properties.push(...this.doDeregisterConfigurations(remove));
    properties.push(...this.doRegisterConfigurations(add, false));

    this.onSchemaChanged.raiseEvent();
    this.onConfigurationUpdated.raiseEvent(distinct(properties));
  }

  private doRegisterConfigurations(configurations: ConfigurationNode[], validate: boolean): string[] {
    const properties: string[] = [];
    configurations.forEach((configuration) => {
      properties.push(...this.validateAndRegisterProperties(configuration, validate)); // fills in defaults
      this._configurationContributors.push(configuration);
      this.registerJSONConfiguration(configuration);
    });
    return properties;
  }

  private doDeregisterConfigurations(configurations: ConfigurationNode[]): string[] {
    const properties: string[] = [];
    const deregisterConfiguration = (configuration: ConfigurationNode) => {
      if (configuration.properties) {
        // eslint-disable-next-line guard-for-in
        for (const key in configuration.properties) {
          properties.push(key);
          delete this._configurationProperties[key];
          this.removeFromSchema(key, configuration.properties[key]);
        }
      }
    };
    for (const configuration of configurations) {
      deregisterConfiguration(configuration);
      const index = this._configurationContributors.indexOf(configuration);
      if (index !== -1) {
        this._configurationContributors.splice(index, 1);
      }
    }
    return properties;
  }

  private validateAndRegisterProperties(configuration: ConfigurationNode, validate: boolean = true): string[] {
    const propertyKeys: string[] = [];
    const properties = configuration.properties;
    if (properties) {
      // eslint-disable-next-line guard-for-in
      for (const key in properties) {
        if (validate && validateProperty(key)) {
          delete properties[key];
          continue;
        }

        const property = properties[key];

        // update default value
        this.updatePropertyDefaultValue(key, property);

        // Add to properties maps
        // Property is included by default if 'included' is unspecified
        if (properties[key].hasOwnProperty("included") && !properties[key].included) {
          this._excludedConfigurationProperties[key] = properties[key];
          delete properties[key];
          continue;
        } else {
          this._configurationProperties[key] = properties[key];
        }

        if (!properties[key].deprecationMessage && properties[key].markdownDeprecationMessage) {
          // If not set, default deprecationMessage to the markdown source
          properties[key].deprecationMessage = properties[key].markdownDeprecationMessage;
        }

        propertyKeys.push(key);
      }
    }
    return propertyKeys;
  }

  private registerJSONConfiguration(configuration: ConfigurationNode) {
    const register = (config: ConfigurationNode) => {
      const properties = config.properties;
      if (properties) {
        // eslint-disable-next-line guard-for-in
        for (const key in properties) {
          this.updateSchema(key, properties[key]);
        }
      }
    };
    register(configuration);
  }

  private updateSchema(key: string, property: ConfigurationPropertySchema): void {
    allSettings.properties[key] = property;
  }

  private removeFromSchema(key: string): void {
    delete allSettings.properties[key];
  }

  private updatePropertyDefaultValue(key: string, property: ConfigurationPropertySchema): void {
    let defaultValue = this._defaultValues[key];
    if (undefined === typeof defaultValue) {
      defaultValue = property.default;
    }
    if (undefined === typeof defaultValue) {
      defaultValue = getDefaultValue(property.type);
    }
    property.default = defaultValue;
  }
}

export function getDefaultValue(type: string | string[] | undefined): any {
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
      return null;
  }
}

const configurationRegistry = new ConfigurationRegistry();

export function validateProperty(property: string): string | null {
  if (!property.trim()) {
    return nls.localize("config.property.empty", "Cannot register an empty property");
  }
  if (OVERRIDE_PROPERTY_PATTERN.test(property)) {
    return nls.localize("config.property.languageDefault", "Cannot register '{0}'. This matches property pattern '\\\\[.*\\\\]$' for describing language specific editor settings. Use 'configurationDefaults' contribution.", property);
  }
  if (configurationRegistry.getConfigurationProperties()[property] !== undefined) {
    return nls.localize("config.property.duplicate", "Cannot register '{0}'. This property is already registered.", property);
  }
  return null;
}

export function getScopes(): [string, ConfigurationScope | undefined][] {
  const scopes: [string, ConfigurationScope | undefined][] = [];
  const configurationProperties = configurationRegistry.getConfigurationProperties();
  for (const key of Object.keys(configurationProperties)) {
    scopes.push([key, configurationProperties[key].scope]);
  }
  scopes.push(["launch", ConfigurationScope.RESOURCE]);
  scopes.push(["task", ConfigurationScope.RESOURCE]);
  return scopes;
}
