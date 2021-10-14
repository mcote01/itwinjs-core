/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Json
 */

import { BeEvent, JSONSchema } from "@itwin/core-bentley";

/**  A JavaScript object that acts a dictionary. The keys are strings. */
export type StringDictionary<V> = Record<string, V>;

export interface ConfigurationRegistry {
  /** Register one or more configurations */
  registerConfiguration(configurations: ConfigurationNode | ConfigurationNode[], validate?: boolean): void;

  /**  Deregister multiple configurations from the registry. */
  removeConfiguration(configurations: ConfigurationNode | ConfigurationNode[]): void;

  /** Event that fires whenever a configuration schema changes */
  onSchemaChanged: BeEvent<() => void>;

  onConfigurationUpdated: BeEvent<() => string[]>;

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

class ConfigurationRegistryImpl implements ConfigurationRegistry {

  private readonly _defaultValues: StringDictionary<any>;
  private readonly _configurationContributors: ConfigurationNode[];
  private readonly _configurationProperties: { [qualifiedKey: string]: IJSONSchema };

  private readonly _onDidSchemaChange = new Emitter<void>();
  readonly onDidSchemaChange: Event<void> = this._onDidSchemaChange.event;

  private readonly _onDidUpdateConfiguration: Emitter<string[]> = new Emitter<string[]>();
  readonly onDidUpdateConfiguration: Event<string[]> = this._onDidUpdateConfiguration.event;

  constructor() {
    this.defaultValues = {};
    this.defaultLanguageConfigurationOverridesNode = {
      id: "defaultOverrides",
      title: nls.localize("defaultLanguageConfigurationOverrides.title", "Default Language Configuration Overrides"),
      properties: {},
    };
    this.configurationContributors = [this.defaultLanguageConfigurationOverridesNode];
    this.resourceLanguageSettingsSchema = { properties: {}, patternProperties: {}, additionalProperties: false, errorMessage: "Unknown editor configuration setting", allowTrailingCommas: true, allowComments: true };
    this.configurationProperties = {};
    this.excludedConfigurationProperties = {};

    contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
  }

  public registerConfiguration(configuration: ConfigurationNode, validate: boolean = true): void {
    this.registerConfigurations([configuration], validate);
  }

  public registerConfigurations(configurations: ConfigurationNode[], validate: boolean = true): void {
    const properties = this.doRegisterConfigurations(configurations, validate);

    contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
    this._onDidSchemaChange.fire();
    this._onDidUpdateConfiguration.fire(properties);
  }

  public deregisterConfigurations(configurations: ConfigurationNode[]): void {
    const properties = this.doDeregisterConfigurations(configurations);

    contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
    this._onDidSchemaChange.fire();
    this._onDidUpdateConfiguration.fire(properties);
  }

  public updateConfigurations({ add, remove }: { add: ConfigurationNode[], remove: ConfigurationNode[] }): void {
    const properties = [];
    properties.push(...this.doDeregisterConfigurations(remove));
    properties.push(...this.doRegisterConfigurations(add, false));

    contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
    this._onDidSchemaChange.fire();
    this._onDidUpdateConfiguration.fire(distinct(properties));
  }

  public registerDefaultConfigurations(defaultConfigurations: StringDictionary<any>[]): void {
    const properties: string[] = [];
    const overrideIdentifiers: string[] = [];

    for (const defaultConfiguration of defaultConfigurations) {
      for (const key in defaultConfiguration) {
        properties.push(key);

        if (OVERRIDE_PROPERTY_PATTERN.test(key)) {
          this.defaultValues[key] = { ...(this.defaultValues[key] || {}), ...defaultConfiguration[key] };
          const property: ConfigurationPropertySchema = {
            type: "object",
            default: this.defaultValues[key],
            description: nls.localize("defaultLanguageConfiguration.description", "Configure settings to be overridden for {0} language.", key),
            $ref: resourceLanguageSettingsSchemaId,
          };
          overrideIdentifiers.push(overrideIdentifierFromKey(key));
          this.configurationProperties[key] = property;
          this.defaultLanguageConfigurationOverridesNode.properties![key] = property;
        } else {
          this.defaultValues[key] = defaultConfiguration[key];
          const property = this.configurationProperties[key];
          if (property) {
            this.updatePropertyDefaultValue(key, property);
            this.updateSchema(key, property);
          }
        }
      }
    }

    this.registerOverrideIdentifiers(overrideIdentifiers);
    this._onDidSchemaChange.fire();
    this._onDidUpdateConfiguration.fire(properties);
  }

  public deregisterDefaultConfigurations(defaultConfigurations: StringDictionary<any>[]): void {
    const properties: string[] = [];
    for (const defaultConfiguration of defaultConfigurations) {
      for (const key in defaultConfiguration) {
        properties.push(key);
        delete this.defaultValues[key];
        if (OVERRIDE_PROPERTY_PATTERN.test(key)) {
          delete this.configurationProperties[key];
          delete this.defaultLanguageConfigurationOverridesNode.properties![key];
        } else {
          const property = this.configurationProperties[key];
          if (property) {
            this.updatePropertyDefaultValue(key, property);
            this.updateSchema(key, property);
          }
        }
      }
    }

    this.updateOverridePropertyPatternKey();
    this._onDidSchemaChange.fire();
    this._onDidUpdateConfiguration.fire(properties);
  }

  public notifyConfigurationSchemaUpdated(...configurations: ConfigurationNode[]) {
    this._onDidSchemaChange.fire();
  }

  public registerOverrideIdentifiers(overrideIdentifiers: string[]): void {
    for (const overrideIdentifier of overrideIdentifiers) {
      this.overrideIdentifiers.add(overrideIdentifier);
    }
    this.updateOverridePropertyPatternKey();
  }

  private doRegisterConfigurations(configurations: ConfigurationNode[], validate: boolean): string[] {
    const properties: string[] = [];
    configurations.forEach((configuration) => {
      properties.push(...this.validateAndRegisterProperties(configuration, validate, configuration.extensionInfo)); // fills in defaults
      this.configurationContributors.push(configuration);
      this.registerJSONConfiguration(configuration);
    });
    return properties;
  }

  private doDeregisterConfigurations(configurations: ConfigurationNode[]): string[] {
    const properties: string[] = [];
    const deregisterConfiguration = (configuration: ConfigurationNode) => {
      if (configuration.properties) {
        for (const key in configuration.properties) {
          properties.push(key);
          delete this.configurationProperties[key];
          this.removeFromSchema(key, configuration.properties[key]);
        }
      }
      if (configuration.allOf) {
        configuration.allOf.forEach((node) => deregisterConfiguration(node));
      }
    };
    for (const configuration of configurations) {
      deregisterConfiguration(configuration);
      const index = this.configurationContributors.indexOf(configuration);
      if (index !== -1) {
        this.configurationContributors.splice(index, 1);
      }
    }
    return properties;
  }

  private validateAndRegisterProperties(configuration: ConfigurationNode, validate: boolean = true, extensionInfo?: IConfigurationExtensionInfo, scope: ConfigurationScope = ConfigurationScope.WINDOW): string[] {
    scope = types.isUndefinedOrNull(configuration.scope) ? scope : configuration.scope;
    const propertyKeys: string[] = [];
    const properties = configuration.properties;
    if (properties) {
      for (const key in properties) {
        if (validate && validateProperty(key)) {
          delete properties[key];
          continue;
        }

        const property = properties[key];

        // update default value
        this.updatePropertyDefaultValue(key, property);

        // update scope
        if (OVERRIDE_PROPERTY_PATTERN.test(key)) {
          property.scope = undefined; // No scope for overridable properties `[${identifier}]`
        } else {
          property.scope = types.isUndefinedOrNull(property.scope) ? scope : property.scope;
          property.restricted = types.isUndefinedOrNull(property.restricted) ? !!extensionInfo?.restrictedConfigurations?.includes(key) : property.restricted;
        }

        // Add to properties maps
        // Property is included by default if 'included' is unspecified
        if (properties[key].hasOwnProperty("included") && !properties[key].included) {
          this.excludedConfigurationProperties[key] = properties[key];
          delete properties[key];
          continue;
        } else {
          this.configurationProperties[key] = properties[key];
        }

        if (!properties[key].deprecationMessage && properties[key].markdownDeprecationMessage) {
          // If not set, default deprecationMessage to the markdown source
          properties[key].deprecationMessage = properties[key].markdownDeprecationMessage;
        }

        propertyKeys.push(key);
      }
    }
    const subNodes = configuration.allOf;
    if (subNodes) {
      for (const node of subNodes) {
        propertyKeys.push(...this.validateAndRegisterProperties(node, validate, extensionInfo, scope));
      }
    }
    return propertyKeys;
  }

  getConfigurations(): ConfigurationNode[] {
    return this.configurationContributors;
  }

  getConfigurationProperties(): { [qualifiedKey: string]: ConfigurationPropertySchema } {
    return this.configurationProperties;
  }

  getExcludedConfigurationProperties(): { [qualifiedKey: string]: ConfigurationPropertySchema } {
    return this.excludedConfigurationProperties;
  }

  private registerJSONConfiguration(configuration: ConfigurationNode) {
    const register = (configuration: ConfigurationNode) => {
      const properties = configuration.properties;
      if (properties) {
        for (const key in properties) {
          this.updateSchema(key, properties[key]);
        }
      }
      const subNodes = configuration.allOf;
      if (subNodes) {
        subNodes.forEach(register);
      }
    };
    register(configuration);
  }

  private updateSchema(key: string, property: ConfigurationPropertySchema): void {
    allSettings.properties[key] = property;
    switch (property.scope) {
      case ConfigurationScope.APPLICATION:
        applicationSettings.properties[key] = property;
        break;
      case ConfigurationScope.MACHINE:
        machineSettings.properties[key] = property;
        break;
      case ConfigurationScope.MACHINE_OVERRIDABLE:
        machineOverridableSettings.properties[key] = property;
        break;
      case ConfigurationScope.WINDOW:
        windowSettings.properties[key] = property;
        break;
      case ConfigurationScope.RESOURCE:
        resourceSettings.properties[key] = property;
        break;
      case ConfigurationScope.LANGUAGE_OVERRIDABLE:
        resourceSettings.properties[key] = property;
        this.resourceLanguageSettingsSchema.properties![key] = property;
        break;
    }
  }

  private removeFromSchema(key: string, property: ConfigurationPropertySchema): void {
    delete allSettings.properties[key];
    switch (property.scope) {
      case ConfigurationScope.APPLICATION:
        delete applicationSettings.properties[key];
        break;
      case ConfigurationScope.MACHINE:
        delete machineSettings.properties[key];
        break;
      case ConfigurationScope.MACHINE_OVERRIDABLE:
        delete machineOverridableSettings.properties[key];
        break;
      case ConfigurationScope.WINDOW:
        delete windowSettings.properties[key];
        break;
      case ConfigurationScope.RESOURCE:
      case ConfigurationScope.LANGUAGE_OVERRIDABLE:
        delete resourceSettings.properties[key];
        break;
    }
  }

  private updateOverridePropertyPatternKey(): void {
    for (const overrideIdentifier of this.overrideIdentifiers.values()) {
      const overrideIdentifierProperty = `[${overrideIdentifier}]`;
      const resourceLanguagePropertiesSchema: IJSONSchema = {
        type: "object",
        description: nls.localize("overrideSettings.defaultDescription", "Configure editor settings to be overridden for a language."),
        errorMessage: nls.localize("overrideSettings.errorMessage", "This setting does not support per-language configuration."),
        $ref: resourceLanguageSettingsSchemaId,
      };
      this.updatePropertyDefaultValue(overrideIdentifierProperty, resourceLanguagePropertiesSchema);
      allSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
      applicationSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
      machineSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
      machineOverridableSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
      windowSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
      resourceSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
    }
    this._onDidSchemaChange.fire();
  }

  private updatePropertyDefaultValue(key: string, property: ConfigurationPropertySchema): void {
    let defaultValue = this.defaultValues[key];
    if (types.isUndefined(defaultValue)) {
      defaultValue = property.default;
    }
    if (types.isUndefined(defaultValue)) {
      defaultValue = getDefaultValue(property.type);
    }
    property.default = defaultValue;
  }
}

const OVERRIDE_PROPERTY = "\\[.*\\]$";
export const OVERRIDE_PROPERTY_PATTERN = new RegExp(OVERRIDE_PROPERTY);

export function overrideIdentifierFromKey(key: string): string {
  return key.substring(1, key.length - 1);
}

export function getDefaultValue(type: string | string[] | undefined): any {
  const t = Array.isArray(type) ? (type)[0] : <string>type;
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
Registry.add(Extensions.Configuration, configurationRegistry);

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
