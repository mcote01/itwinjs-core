/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as path from "path";
import { ClassRegistry, Schema, Schemas } from "@bentley/imodeljs-backend";
import * as elementsModule from "./ToyTileElements";
import * as modelsModule from "./ToyTileModels";

/** Schema class for the ToyTile domain.
 * @beta
 */
export class ToyTileSchema extends Schema {
  public static override get schemaName(): string { return "ToyTile"; }
  public static get schemaFilePath(): string {
    return path.join(__dirname, "../assets/ToyTile.ecschema.xml");
  }
  public static registerSchema() {
    if (this !== Schemas.getRegisteredSchema(this.schemaName)) {
      Schemas.unregisterSchema(this.schemaName);
      Schemas.registerSchema(this);

      ClassRegistry.registerModule(elementsModule, this);
      ClassRegistry.registerModule(modelsModule, this);
    }
  }
}
