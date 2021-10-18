/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import { SettingsGroupSpec, SettingsSpecRegistry } from "../settings/SettingsSpecRegistry";

describe.only("SettingsRegistry", () => {

  it("register groups", () => {

    const group: SettingsGroupSpec = {
      groupName: "workbench",
      order: 7,
      title: "Workbench settings",
      properties: {
        "list.multiSelectModifier": {
          type: "string",
          enum: ["ctrlCmd", "alt"],
          enumDescriptions: [
            "Maps to `Control` on Windows and Linux and to `Command` on macOS.",
            "Maps to `Alt` on Windows and Linux and to `Option` on macOS.",
          ],
          default: "ctrlCmd",
          description: "multiSelectModifier",
        },
        "list.openMode": {
          type: "string",
          enum: ["singleClick", "doubleClick"],
          default: "singleClick",
          description: "openModeModifier",
        },
        "list.horizontalScrolling": {
          type: "boolean",
          default: false,
          description: "horizontalScrolling setting",
        },
        "tree.indent": {
          type: "number",
          default: 8,
          minimum: 0,
          maximum: 40,
          description: "tree indent setting",
        },
        "tree.blah": {
          type: "string",
        },
      },
    };
    const props = SettingsSpecRegistry.register(group);
    expect(props.length).equals(0);
    expect(SettingsSpecRegistry.allSpecs.get("workbench.list.openMode")!.type).equals("string");
    expect(SettingsSpecRegistry.allSpecs.get("workbench.list.openMode")!.default).equals("singleClick");
    expect(SettingsSpecRegistry.allSpecs.get("workbench.tree.blah")!.default).equals("");
  });

});
