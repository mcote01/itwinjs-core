/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module OIDC
 */

import { AccessToken, assert, AuthStatus } from "@itwin/core-bentley";
import { AuthorizationClient, IModelError, NativeAppAuthorizationConfiguration } from "@itwin/core-common";
import { ImsAuthorizationClient } from "@bentley/itwin-client";
import { MobileHost } from "./MobileHost";

/** Utility to provide OIDC/OAuth tokens from native ios app to frontend
   * @internal
   */
export class MobileAuthorizationBackend extends ImsAuthorizationClient implements AuthorizationClient {
  protected _accessToken?: AccessToken;
  public config?: NativeAppAuthorizationConfiguration;
  public expireSafety = 60 * 10; // refresh token 10 minutes before real expiration time
  public issuerUrl?: string;
  public static defaultRedirectUri = "imodeljs://app/signin-callback";
  public get redirectUri() { return this.config?.redirectUri ?? MobileAuthorizationBackend.defaultRedirectUri; }

  public constructor(config?: NativeAppAuthorizationConfiguration) {
    super();
    this.config = config;
  }

  // public getClientRequestContext() { return ClientRequestContext.fromJSON(IModelHost.session); }

  /** Used to initialize the client - must be awaited before any other methods are called */
  public async initialize(config?: NativeAppAuthorizationConfiguration): Promise<void> {
    this.config = config ?? this.config;
    if (!this.config)
      throw new IModelError(AuthStatus.Error, "Must specify a valid configuration when initializing authorization");
    if (this.config.expiryBuffer)
      this.expireSafety = this.config.expiryBuffer;
    this.issuerUrl = this.config.issuerUrl ?? await this.getUrl();
    if (!this.issuerUrl)
      throw new IModelError(AuthStatus.Error, "The URL of the authorization provider was not initialized");

    MobileHost.device.authStateChanged = (tokenString?: AccessToken) => {
      this.setAccessToken(tokenString);
    };

    return new Promise<void>((resolve, reject) => {
      assert(this.config !== undefined);
      MobileHost.device.authInit({ ...this.config, issuerUrl: this.issuerUrl }, (err?: string) => {
        if (!err) {
          resolve();
        } else {
          reject(new Error(err));
        }
      });
    });
  }

  /** Start the sign-in process */
  public async signIn(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      MobileHost.device.authSignIn((err?: string) => {
        if (!err) {
          resolve();
        } else {
          reject(new Error(err));
        }
      });
    });
  }

  /** Start the sign-out process */
  public async signOut(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      MobileHost.device.authSignOut((err?: string) => {
        if (!err) {
          resolve();
        } else {
          reject(new Error(err));
        }
      });
    });
  }

  public setAccessToken(token?: AccessToken) {
    if (token === this._accessToken)
      return;
    this._accessToken = token;
  }

  public async getAccessToken(): Promise<AccessToken> {
    if (!this._accessToken)
      this.setAccessToken(await this.refreshToken());
    return this._accessToken ?? "";
  }

  /** return accessToken */
  public async refreshToken(): Promise<AccessToken> {
    return new Promise<AccessToken>((resolve, reject) => {
      MobileHost.device.authGetAccessToken((tokenStringJson?: AccessToken, err?: string) => {
        if (!err && tokenStringJson) {
          resolve(tokenStringJson);
        } else {
          reject(new Error(err));
        }
      });
    });
  }
}
