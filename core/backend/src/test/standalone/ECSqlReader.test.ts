import { assert } from "chai";
/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { DbResult, using } from "@itwin/core-bentley";
import { QueryConfigBuilder, QueryParams } from "@itwin/core-common";
import { ECSqlStatement } from "../../ECSqlStatement";
import { KnownTestLocations } from "../KnownTestLocations";
import { ECDbTestHelper } from "./ECDbTestHelper";
import { ECDb } from "../../ECDb";

describe("ECSqlReader and ECSqlBlobReader", async () => {
  const outDir = KnownTestLocations.outputDir;

  it("ecsql reader simple", async () => {
    await using(ECDbTestHelper.createECDb(outDir, "test.ecdb",
      `<ECSchema schemaName="Test" alias="ts" version="01.00.00" xmlns="http://www.bentley.com/schemas/Bentley.ECXML.3.2">
        <ECEntityClass typeName="Foo" modifier="Sealed">
          <ECProperty propertyName="n" typeName="int"/>
        </ECEntityClass>
      </ECSchema>`), async (ecdb: ECDb) => {
      assert.isTrue(ecdb.isOpen);

      const r = await ecdb.withStatement("INSERT INTO ts.Foo(n) VALUES(20)", async (stmt: ECSqlStatement) => {
        return stmt.stepForInsert();
      });
      ecdb.saveChanges();
      assert.equal(r.status, DbResult.BE_SQLITE_DONE);
      assert.equal(r.id, "0x1");
      const params = new QueryParams();
      params.bindString("name", "CompositeUnitRefersToUnit");
      const config = new QueryConfigBuilder();
      const reader = ecdb.createQueryReader("SELECT ECInstanceId, Name FROM meta.ECClassDef WHERE Name=:name", params, config.config);
      while (await reader.step()) {
        // eslint-disable-next-line no-console
        assert.equal(reader.current.id, "0x32");
        assert.equal(reader.current.ecinstanceid, "0x32");
        assert.equal(reader.current.name, "CompositeUnitRefersToUnit");
        assert.equal(reader.current.ID, "0x32");
        assert.equal(reader.current.ECINSTANCEID, "0x32");
        assert.equal(reader.current[0], "0x32");
        assert.equal(reader.current[1], "CompositeUnitRefersToUnit");

        const row0 = reader.current.toRow();
        assert.equal(row0.ECInstanceId, "0x32");
        assert.equal(row0.Name, "CompositeUnitRefersToUnit");

        const row1 = reader.current.toJsRow();
        assert.equal(row1.id, "0x32");
        assert.equal(row1.name, "CompositeUnitRefersToUnit");
      }
    });
  });
});
