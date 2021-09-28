/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { AgentAuthorizationClient, AgentAuthorizationClientConfiguration } from "@bentley/backend-itwin-client";
import { AccessToken } from "@bentley/bentleyjs-core";
import { executeBackendCallback, registerBackendCallback } from "@bentley/certa/lib/utils/CallbackUtils";

const getEnvCallbackName = "getEnv";
const getClientAccessTokenCallbackName = "getClientAccessToken";

export function exposeBackendCallbacks() {
  registerBackendCallback(getEnvCallbackName, () => {
    return JSON.stringify(process.env);
  });

  registerBackendCallback(getClientAccessTokenCallbackName, async (clientConfiguration: AgentAuthorizationClientConfiguration) => {
    const authClient = new AgentAuthorizationClient(clientConfiguration);
    const token = await authClient.getAccessToken();
    return token ?? "";
  });

}

export async function getProcessEnvFromBackend(): Promise<NodeJS.ProcessEnv> {
  return JSON.parse(await executeBackendCallback(getEnvCallbackName));
}

export async function getClientAccessTokenFromBackend(clientConfiguration: AgentAuthorizationClientConfiguration): Promise<AccessToken> {
  const tokenString = await executeBackendCallback(getClientAccessTokenCallbackName, clientConfiguration);
  return tokenString;
}
