/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import { SettingsSpecRegistry } from "../settings/SettingsSpecRegistry";

describe.only("SettingsRegistry", () => {

  it("register groups", () => {
    const props = SettingsSpecRegistry.register({
      groupName: "workbench",
      order: 7,
      title: "Workbench settings",
      properties: {
        ["workbench.list.multiSelectModifier"]: {
          type: "string",
          enum: ["ctrlCmd", "alt"],
          enumDescriptions: [
            "Maps to `Control` on Windows and Linux and to `Command` on macOS.",
            "Maps to `Alt` on Windows and Linux and to `Option` on macOS.",
          ],
          default: "ctrlCmd",
          description: "multiSelectModifier",
        },
        ["workbench.list.openMode"]: {
          type: "string",
          enum: ["singleClick", "doubleClick"],
          default: "singleClick",
          description: "openModeModifier",
        },
        ["workbench.list.horizontalScrolling"]: {
          type: "boolean",
          default: false,
          description: "horizontalScrolling setting",
        },
        ["workbench.tree.indent"]: {
          type: "number",
          default: 8,
          minimum: 0,
          maximum: 40,
          description: "tree indent setting",
        },
        ["workbench.tree.blah"]: {
          type: "string",
        },
      },
    });
    expect(props.length).equals(0);
    expect(SettingsSpecRegistry.allSpecs["workbench.list.openMode"]!.type).equals("string");
    expect(SettingsSpecRegistry.allSpecs["workbench.list.openMode"]!.default).equals("singleClick");
    expect(SettingsSpecRegistry.allSpecs["workbench.tree.blah"]!.default).equals("");
    expect(Object.getOwnPropertyNames(SettingsSpecRegistry.allSpecs)).includes.members(["workbench.list.openMode"]);
  });

});
