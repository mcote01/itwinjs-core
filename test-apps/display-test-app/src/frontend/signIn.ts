/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { ElectronAppAuthorization } from "@itwin/core-electron/lib/ElectronFrontend";
import { IModelApp } from "@itwin/core-frontend";
import { BrowserAuthorizationClient } from "@bentley/frontend-authorization-client";
import { AccessToken } from "@itwin/core-bentley";

// Wraps the signIn process
// @return Promise that resolves to true after signIn is complete
export async function signIn(): Promise<boolean> {
  const auth = IModelApp.authorizationClient;
  if (undefined !== auth && (auth instanceof BrowserAuthorizationClient || auth instanceof ElectronAppAuthorization)) {
    if (auth.isAuthorized) {
      return (await auth.getAccessToken()) !== undefined;
    }

    return new Promise<boolean>((resolve, reject) => {
      auth.onAccessTokenChanged.addOnce((token: AccessToken) => resolve(token !== ""));
      auth.signIn().catch((err) => reject(err));
    });
  }

  const browserAuth = new BrowserAuthorizationClient({
    clientId: "imodeljs-spa-test",
    redirectUri: "http://localhost:3000/signin-callback",
    scope: "openid email profile organization itwinjs",
    responseType: "code",
  });
  try {
    await browserAuth.signInSilent();
  } catch (err) { }

  IModelApp.authorizationClient = browserAuth;

  if (browserAuth.isAuthorized)
    return true;

  return new Promise<boolean>((resolve, reject) => {
    browserAuth.onAccessTokenChanged.addOnce((token: AccessToken) => resolve(token !== ""));
    browserAuth.signIn().catch((err) => reject(err));
  });
}
