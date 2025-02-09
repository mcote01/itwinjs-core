## API Report File for "@bentley/product-settings-client"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { AccessToken } from '@itwin/core-bentley';
import { Client } from '@bentley/itwin-client';
import { RequestOptions } from '@bentley/itwin-client';
import { Response } from '@bentley/itwin-client';

// @internal
export class ConnectSettingsClient extends Client implements SettingsAdmin {
    constructor(applicationId: string);
    // (undocumented)
    static readonly apiVersion: string;
    // (undocumented)
    applicationId: string;
    // (undocumented)
    deleteSetting(accessToken: AccessToken, settingNamespace: string, settingName: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsResult>;
    // (undocumented)
    deleteSharedSetting(accessToken: AccessToken, settingNamespace: string, settingName: string, applicationSpecific: boolean, iTwinId: string, iModelId?: string): Promise<SettingsResult>;
    // (undocumented)
    deleteUserSetting(accessToken: AccessToken, settingNamespace: string, settingName: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsResult>;
    formErrorResponse(response: Response): SettingsResult;
    // (undocumented)
    getSetting(accessToken: AccessToken, settingNamespace: string, settingName: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsResult>;
    // (undocumented)
    getSettingsByNamespace(accessToken: AccessToken, namespace: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsMapResult>;
    // (undocumented)
    getSharedSetting(accessToken: AccessToken, settingNamespace: string, settingName: string, applicationSpecific: boolean, iTwinId: string, iModelId?: string): Promise<SettingsResult>;
    // (undocumented)
    getSharedSettingsByNamespace(accessToken: AccessToken, namespace: string, applicationSpecific: boolean, iTwinId: string, iModelId?: string): Promise<SettingsMapResult>;
    getUrl(excludeApiVersion?: boolean): Promise<string>;
    // (undocumented)
    getUserSetting(accessToken: AccessToken, settingNamespace: string, settingName: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsResult>;
    // (undocumented)
    getUserSettingsByNamespace(accessToken: AccessToken, namespace: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsMapResult>;
    // (undocumented)
    saveSetting(accessToken: AccessToken, settings: any, settingNamespace: string, settingName: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsResult>;
    // (undocumented)
    saveSharedSetting(accessToken: AccessToken, settings: any, settingNamespace: string, settingName: string, applicationSpecific: boolean, iTwinId: string, iModelId?: string): Promise<SettingsResult>;
    // (undocumented)
    saveUserSetting(accessToken: AccessToken, settings: any, settingNamespace: string, settingName: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsResult>;
    // (undocumented)
    protected setupOptionDefaults(options: RequestOptions): Promise<void>;
}

// @beta
export interface SettingsAdmin {
    deleteSetting(accessToken: AccessToken, namespace: string, name: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsResult>;
    deleteSharedSetting(accessToken: AccessToken, namespace: string, name: string, applicationSpecific: boolean, iTwinId: string, iModelId?: string): Promise<SettingsResult>;
    deleteUserSetting(accessToken: AccessToken, namespace: string, name: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsResult>;
    getSetting(accessToken: AccessToken, namespace: string, name: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsResult>;
    getSettingsByNamespace(accessToken: AccessToken, namespace: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsMapResult>;
    getSharedSetting(accessToken: AccessToken, namespace: string, name: string, applicationSpecific: boolean, iTwinId: string, iModelId?: string): Promise<SettingsResult>;
    getSharedSettingsByNamespace(accessToken: AccessToken, namespace: string, applicationSpecific: boolean, iTwinId: string, iModelId?: string): Promise<SettingsMapResult>;
    getUserSetting(accessToken: AccessToken, namespace: string, name: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsResult>;
    getUserSettingsByNamespace(accessToken: AccessToken, namespace: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsMapResult>;
    saveSetting(accessToken: AccessToken, settings: any, namespace: string, name: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsResult>;
    saveSharedSetting(accessToken: AccessToken, settings: any, namespace: string, name: string, applicationSpecific: boolean, iTwinId: string, iModelId?: string): Promise<SettingsResult>;
    saveUserSetting(accessToken: AccessToken, settings: any, namespace: string, name: string, applicationSpecific: boolean, iTwinId?: string, iModelId?: string): Promise<SettingsResult>;
}

// @beta
export class SettingsMapResult {
    // @internal
    constructor(status: SettingsStatus, errorMessage?: string | undefined, settingsMap?: Map<string, any> | undefined);
    // (undocumented)
    errorMessage?: string | undefined;
    // (undocumented)
    settingsMap?: Map<string, any> | undefined;
    // (undocumented)
    status: SettingsStatus;
}

// @beta
export class SettingsResult {
    // @internal
    constructor(status: SettingsStatus, errorMessage?: string | undefined, setting?: any);
    // (undocumented)
    errorMessage?: string | undefined;
    // (undocumented)
    setting?: any;
    // (undocumented)
    status: SettingsStatus;
}

// @beta
export enum SettingsStatus {
    AuthorizationError = 110593,
    IModelInvalid = 110596,
    ITwinInvalid = 110595,
    ServerError = 110598,
    SettingNotFound = 110597,
    // (undocumented)
    SETTINGS_ERROR_BASE = 110592,
    Success = 0,
    UnknownError = 110600,
    UrlError = 110594
}


// (No @packageDocumentation comment for this package)

```
