/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import { IModelTestUtils } from "./IModelTestUtils";
import * as fs from "fs-extra";
import { parse } from "json5";
import { Settings, SettingsPriority } from "../settings/Settings";
import { SettingsGroupSpec, SettingSpec, SettingsSpecRegistry } from "../settings/SettingsSpecRegistry";
import { Mutable } from "@itwin/core-bentley";

describe.only("Settings", () => {

  const group1: SettingsGroupSpec = {
    groupName: "group1",
    title: "group 1 settings",
    properties: {
      sub1: {
        type: "string",
        enum: ["va1", "alt1"],
        enumDescriptions: [
          "descr1",
          "descr2",
        ],
        default: "val1",
        description: "the first value",
      },
      sub2: {
        type: "array",
        description: "an array",
      },
      boolVal: {
        type: "boolean",
        default: true,
        description: "boolean defaults to true",
      },
      strVal: {
        type: "string",
        default: "default string val",
      },
      intVal: {
        type: "integer",
        default: 22,
      },
    },
  };

  SettingsSpecRegistry.register(group1);
  const imodel1Settings = {
    "group1.sub1": "imodel1 value",
    "group1.sub2": {
      arr: ["a1", "a2"],
    },
    "setting2": 2,
    "setting3": "setting 3 val",
  };

  const imodel2Settings = {
    "group1.sub1": "imodel2 value",
    "group1.sub2": {
      arr: ["a21", "a22"],
    },
  };

  const iTwinSettings = {
    "group1.sub1": "val3",
    "group1.sub2": {
      arr: ["a31", "a32", "a33"],
    },
    "group2.setting6": "val 6",
    "group3.obj": {
      member1: "test2",
      member2: "test3",
      member3: {
        part1: "p1",
        part2: [
          { m1: 0 },
          { m1: 2 },
        ],
      },
    },
  };

  it("priority test", () => {
    Settings.reset();
    Settings.add("iModel1.setting.json", SettingsPriority.iModel, imodel1Settings);
    Settings.add("iModel2.setting.json", SettingsPriority.iModel, imodel2Settings);
    Settings.add("iTwin.setting.json", SettingsPriority.iTwin, iTwinSettings);

    expect(Settings.getSetting<string>("group1.sub1")).equals(imodel2Settings["group1.sub1"]);
    expect(Settings.getSetting<string>("group2.setting6")).equals(iTwinSettings["group2.setting6"]);
    expect(Settings.getSetting<any>("group1.sub2").arr).deep.equals(imodel2Settings["group1.sub2"].arr);

    const group3obj = Settings.getSetting<any>("group3.obj");
    expect(group3obj).deep.equals(iTwinSettings["group3.obj"]);
    group3obj.member3.part2[0].m1 = "bad"; // should modify a copy
    expect(iTwinSettings["group3.obj"].member3.part2[0].m1).equal(0);

    expect(Settings.getSetting<any>("group3.obj")).deep.equals(iTwinSettings["group3.obj"]); // should be original value
    expect(Settings.getSetting<boolean>("group1.boolVal")).equals(true);
    expect(Settings.getSetting<string>("group1.strVal")).equals(group1.properties.strVal.default);
    expect(Settings.getSetting<number>("group1.intVal")).equals(22);
    expect(Settings.getSetting("not there")).is.undefined;

    iTwinSettings["group2.setting6"] = "new value for 6";
    Settings.add("iTwin.setting.json", SettingsPriority.iTwin, iTwinSettings);
    expect(Settings.getSetting<string>("group2.setting6")).equals(iTwinSettings["group2.setting6"]);

    (group1.properties.strVal as Mutable<SettingSpec>).default = "new default";
    SettingsSpecRegistry.register(group1);
    // after re-registering, the new default should be updated
    expect(Settings.getSetting<string>("group1.strVal")).equals(group1.properties.strVal.default);

    Settings.drop("iTwin.setting.json");
    expect(Settings.getSetting<string>("setting6")).is.undefined;
  });

  it("Read Settings", () => {
    Settings.reset();
    const fileName = IModelTestUtils.resolveAssetFile("test.setting.json5");
    const settingRaw = fs.readFileSync(fileName, "utf-8");
    const settingFile = parse(settingRaw);
    Settings.add(fileName, 1, settingFile);
    expect(Settings.getSetting<string>("workbench.colorTheme")).equals("Visual Studio Light");
    const token = Settings.getSetting<any>("editor.tokenColorCustomizations");
    expect(token["[Visual Studio Light]"].textMateRules[0].settings.foreground).equals("#d16c6c");
    expect(token["[Default High Contrast]"].comments).equals("#FF0000");
  });
});
