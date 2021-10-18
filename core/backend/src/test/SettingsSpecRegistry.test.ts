/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import { SettingsSpecRegistry } from "../settings/SettingsSpecRegistry";
import * as fs from "fs-extra";
import { IModelTestUtils } from ".";
import { parse } from "json5";

describe.only("SettingsRegistry", () => {

  it("register groups", () => {
    const fileName = IModelTestUtils.resolveAssetFile("Settings.schema.json");
    const settingRaw = fs.readFileSync(fileName, "utf-8");
    const group1 = parse(settingRaw);

    SettingsSpecRegistry.reset();
    const props = SettingsSpecRegistry.register(group1);

    expect(props.length).equals(0);
    expect(SettingsSpecRegistry.allSpecs.get("group1.list.openMode")!.type).equals("string");
    expect(SettingsSpecRegistry.allSpecs.get("group1.list.openMode")!.default).equals("singleClick");
    expect(SettingsSpecRegistry.allSpecs.get("group1.tree.blah")!.default).equals("blah default");
  });

});
