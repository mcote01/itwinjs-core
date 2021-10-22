/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Range3d } from "@itwin/core-geometry";
import { expect } from "chai";
import { IModelJsFs } from "../../IModelJsFs";
import { WorkspaceFile } from "../../workspace/WorkspaceFile";
import { IModelTestUtils } from "../IModelTestUtils";
import * as fs from "fs-extra";

describe.only("WorkspaceFile", () => {

  it("create new WorkspaceFile", () => {
    const wsFile = new WorkspaceFile("Ames rubber");
    const dir = wsFile.getContainerDir();
    IModelJsFs.purgeDirSync(dir);
    wsFile.create();

    const testRange = new Range3d(1.2, 2.3, 3.4, 4.5, 5.6, 6.7);
    const blobVal = new Uint8Array(testRange.toFloat64Array().buffer);
    const strval = "this is test1";
    wsFile.addBlob("blob 1", blobVal);
    wsFile.addString("string 1", strval);
    expect(wsFile.getString("string 1")).equals(strval);
    expect(wsFile.getBlob("blob 1")).to.deep.equal(blobVal);

    const inFile = IModelTestUtils.resolveAssetFile("test.setting.json5");
    wsFile.addFile("setting12", inFile);
    const outFile = wsFile.getFile("setting12")!;

    const statOrig = fs.lstatSync(inFile);
    const statExtracted = fs.lstatSync(outFile);
    expect(statOrig.size).equal(statExtracted.size);
    const f1 = fs.readFileSync(inFile);
    const f2 = fs.readFileSync(outFile);
    expect(f1).to.deep.equal(f2);

  });

});
