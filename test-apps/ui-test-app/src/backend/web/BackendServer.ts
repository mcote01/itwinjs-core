/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { Logger } from "@bentley/bentleyjs-core";
import { IModelJsExpressServer } from "@bentley/express-server";
import { IModelHost } from "@bentley/imodeljs-backend";
import { BentleyCloudRpcManager } from "@bentley/imodeljs-common";
import { getSupportedRpcs } from "../../common/rpcs";
import { loggerCategory } from "../../common/TestAppConfiguration";

/**
 * Initializes Web Server backend
 */
export async function initializeWeb() {
  // tell BentleyCloudRpcManager which RPC interfaces to handle
  const rpcConfig = BentleyCloudRpcManager.initializeImpl({ info: { title: "ui-test-app", version: "v1.0" } }, getSupportedRpcs());
  // TODO EDITING const rpcConfig = BentleyCloudRpcManager.initializeImpl({ info: { title: "simple-editor-app", version: "v1.0" } }, rpcs);

  // create a basic express web server
  const port = Number(process.env.PORT || 3001);
  const server = new IModelJsExpressServer(rpcConfig.protocol);
  await server.initialize(port);
  Logger.logInfo(loggerCategory, `Web backend for ui-test-app listening on port ${port}`);
  await IModelHost.startup();
}

