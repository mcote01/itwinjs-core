/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module IModelApp
 */

import { IpcWebSocket, IpcWebSocketFrontend, IpcWebSocketMessage, IpcWebSocketTransport } from "@itwin/core-common";
import { IpcApp } from "./IpcApp";
import { IModelAppOptions } from "./IModelApp";

class LocalTransport extends IpcWebSocketTransport {
  private _client: WebSocket;
  private _pending?: IpcWebSocketMessage[] = [];

  public constructor(port: number) {
    super();

    this._client = new WebSocket(`ws://localhost:${port}/`);

    this._client.addEventListener("open", () => {
      const pending = this._pending!;
      this._pending = undefined;
      pending.forEach((m) => this.send(m));
    });

    this._client.addEventListener("message", async (event) => {
      for (const listener of IpcWebSocket.receivers)
        listener({} as Event, JSON.parse(event.data as string));
    });
  }

  public send(message: IpcWebSocketMessage): void {
    this._pending?.push(message) || this._client.send(JSON.stringify(message));
  }
}

/** @internal */
export interface LocalHostIpcAppOpts {
  iModelApp?: IModelAppOptions;
  localhostIpcApp?: {
    socketPort?: number;
  };
}

/**
 * To be used only by test applications that want to test web-based editing using localhost.
 *  @internal
 */
export class LocalhostIpcApp {
  public static async startup(opts: LocalHostIpcAppOpts) {
    IpcWebSocket.transport = new LocalTransport(opts?.localhostIpcApp?.socketPort ?? 3002);
    const ipc = new IpcWebSocketFrontend();
    await IpcApp.startup(ipc, opts);
  }
}
