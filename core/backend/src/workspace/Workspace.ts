/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Workspace
 */

import { join } from "path";
import { IModelHost } from "../IModelHost";

export class Workspace {

  public static get workspaceRoot() {
    return join(IModelHost.cacheDir, "Workspace");
  }
}
