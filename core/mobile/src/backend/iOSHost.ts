/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IpcWebSocketBackend } from "@itwin/core-common";
import { MobileDevice, MobileHost, MobileHostOpts } from "./MobileHost";

/** @beta */
export type IOSHostOpts = MobileHostOpts;

/** @beta */
export class IOSHost extends MobileHost {
  /**
   * Start the backend of an IOS app.
   */
  public static override async startup(opt?: IOSHostOpts): Promise<void> {
    const device = opt?.mobileHost?.device ?? new (MobileDevice as any)();
    const socket = opt?.ipcHost?.socket ?? new IpcWebSocketBackend();
    return MobileHost.startup({ ...opt, mobileHost: { ...opt?.mobileHost, device }, ipcHost: { ...opt?.ipcHost, socket } });
  }
}
