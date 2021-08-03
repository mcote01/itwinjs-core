/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { GroupInformationElement, IModelDb, PhysicalElement, SpatialCategory } from "@bentley/imodeljs-backend";
import { AxisAlignedBox3d, Code, CodeScopeProps, CodeSpec, ElementProps, IModelError, PhysicalElementProps, Placement3d, Placement3dProps } from "@bentley/imodeljs-common";
import { Id64String, IModelStatus, Logger } from "@bentley/bentleyjs-core";
import { TestBridgeLoggerCategory } from "./TestBridgeLoggerCategory";
import { Point3d, XYZProps, YawPitchRollAngles, YawPitchRollProps } from "@bentley/geometry-core";
import { EquilateralTriangleWidgetBuilder, IsoscelesTriangleWidgetBuilder, LargeSquareWidgetBuilder, RectangleWidgetBuilder, RightTriangleWidgetBuilder, SmallSquareWidgetBuilder, WidgetBuilder } from "./TestBridgeGeometry";

export enum CodeSpecs {
  Group = "TestBridge:Group",
}

export enum Categories {
  Category = "TestBridge",
  Casing = "Casing",
  Magnet = "Magnet",
}

export enum GeometryParts {
  SmallSquareCasing = "SmallSquareCasing",
  LargeSquareCasing = "LargeSquareCasing",
  RectangleCasing = "RectangleCasing",
  EquilateralTriangleCasing = "EquilateralTriangleCasing",
  IsoscelesTriangleCasing = "IsoscelesTriangleCasing",
  RightTriangleCasing = "RightTriangleCasing",
  CircularMagnet = "CircularMagnet",
  RectangularMagnet = "RectangularMagnet",
}

export enum Materials {
  ColoredPlastic = "ColoredPlastic",
  MagnetizedFerrite = "MagnetizedFerrite",
}

const loggerCategory: string = TestBridgeLoggerCategory.Bridge;

function toNumber(val: any): number {
  if (val === undefined)
    return 0.0;
  if (typeof(val) == "number")
    return val;
  if (typeof(val) == "string")
    return parseFloat(val);
  throw new IModelError(IModelStatus.BadRequest, `expected number. got ${val}`);
}

export class TestBridgePhysicalElement extends PhysicalElement implements TestBridgePhysicalProps {
  /** @internal */
  public static override get className(): string { return "TestBridgePhysicalElement"; }

  public condition?: string;

  public constructor(props: TestBridgePhysicalProps, iModel: IModelDb) {
    super(props, iModel);
    this.condition = props.condition;
  }
  /** @internal */
  public override toJSON(): TestBridgePhysicalProps {
    const val = super.toJSON() as TestBridgePhysicalProps;
    val.condition = this.condition;
    return val;
  }

  protected static createElement(imodel: IModelDb, physicalModelId: Id64String, definitionModelId: Id64String, widget: any, widgetBuilder: WidgetBuilder, classFullName: string): PhysicalElement {
    const code = TestBridgeGroup.createCode(imodel, physicalModelId, widget.guid);
    const categoryId = SpatialCategory.queryCategoryIdByName(imodel, definitionModelId, Categories.Category);
    if (undefined === categoryId) {
      throw new IModelError(IModelStatus.BadElement, "Unable to find category id for TestBridge category");
    }
    const stream = widgetBuilder.createGeometry(categoryId, widget);
    let origin: XYZProps;
    let angles: YawPitchRollProps;

    if (widget.hasOwnProperty("Placement") && widget.Placement.hasOwnProperty("Origin")) {
      const xyz: XYZProps = {
        x: toNumber(widget.Placement.Origin.x),
        y: toNumber(widget.Placement.Origin.y),
        z: toNumber(widget.Placement.Origin.z),
      };
      origin = xyz;
    } else {
      origin = new Point3d();
    }

    if (widget.hasOwnProperty("Placement") && widget.Placement.hasOwnProperty("Angles")) {
      const yawp: YawPitchRollProps = {
        yaw: toNumber(widget.Placement.Angles.yaw),
        pitch: toNumber(widget.Placement.Angles.pitch),
        roll: toNumber(widget.Placement.Angles.roll),
      };
      angles = yawp;
    } else {
      angles = new YawPitchRollAngles();
    }

    // WIP - Bridge may be requested to apply an additional transform to spatial data
    // placement.TryApplyTransform(GetSpatialDataTransform());

    const placement: Placement3dProps = {
      origin,
      angles,
    };
    const targetPlacement: Placement3d = Placement3d.fromJSON(placement);

    const targetExtents: AxisAlignedBox3d = targetPlacement.calculateRange();
    if (!targetExtents.isNull && !imodel.projectExtents.containsRange(targetExtents)) {
      Logger.logTrace(loggerCategory, "Auto-extending projectExtents");
      targetExtents.extendRange(imodel.projectExtents);
      imodel.updateProjectExtents(targetExtents);
    }

    const props: TestBridgePhysicalProps = {
      code,
      category: categoryId,
      model: physicalModelId,
      classFullName,
      geom: stream,
      condition: widget.condition,
      placement,
    };
    return imodel.elements.createElement(props);
  }

}

export namespace TestBridgePhysicalElement { // eslint-disable-line no-redeclare
  export enum CasingMaterialType {
    Invalid,
    RedPlastic,
    GreenPlastic,
    BluePlastic,
    OrangePlastic,
    PurplePlastic,
    YellowPlastic,
  }
}

export class SmallSquareWidget extends TestBridgePhysicalElement {
  public static override get className(): string { return "SmallSquareWidget"; }

  public static create(imodel: IModelDb, physicalModelId: Id64String, definitionModelId: Id64String, widget: any): PhysicalElement {
    return this.createElement(imodel, physicalModelId, definitionModelId, widget, new SmallSquareWidgetBuilder(imodel, definitionModelId), this.classFullName);
  }
}

export class LargeSquareWidget extends TestBridgePhysicalElement {
  public static override get className(): string { return "LargeSquareWidget"; }

  public static create(imodel: IModelDb, physicalModelId: Id64String, definitionModelId: Id64String, widget: any): PhysicalElement {
    return this.createElement(imodel, physicalModelId, definitionModelId, widget, new LargeSquareWidgetBuilder(imodel, definitionModelId), this.classFullName);
  }
}

export class RectangleWidget extends TestBridgePhysicalElement {
  public static override get className(): string { return "RectangleWidget"; }

  public static create(imodel: IModelDb, physicalModelId: Id64String, definitionModelId: Id64String, widget: any): PhysicalElement {
    return this.createElement(imodel, physicalModelId, definitionModelId, widget, new RectangleWidgetBuilder(imodel, definitionModelId), this.classFullName);
  }
}

export class EquilateralTriangleWidget extends TestBridgePhysicalElement {
  public static override get className(): string { return "EquilateralTriangleWidget"; }

  public static create(imodel: IModelDb, physicalModelId: Id64String, definitionModelId: Id64String, widget: any): PhysicalElement {
    return this.createElement(imodel, physicalModelId, definitionModelId, widget, new EquilateralTriangleWidgetBuilder(imodel, definitionModelId), this.classFullName);
  }
}

export class RightTriangleWidget extends TestBridgePhysicalElement {
  public static override get className(): string { return "RightTriangleWidget"; }

  public static create(imodel: IModelDb, physicalModelId: Id64String, definitionModelId: Id64String, widget: any): PhysicalElement {
    return this.createElement(imodel, physicalModelId, definitionModelId, widget, new RightTriangleWidgetBuilder(imodel, definitionModelId), this.classFullName);
  }
}

export class IsoscelesTriangleWidget extends TestBridgePhysicalElement {
  public static override get className(): string { return "IsoscelesTriangleWidget"; }

  public static create(imodel: IModelDb, physicalModelId: Id64String, definitionModelId: Id64String, widget: any): PhysicalElement {
    return this.createElement(imodel, physicalModelId, definitionModelId, widget, new IsoscelesTriangleWidgetBuilder(imodel, definitionModelId), this.classFullName);
  }
}

export class TestBridgeGroup extends GroupInformationElement implements TestBridgeGroupProps {
  public static override get className(): string { return "TestBridgeGroup"; }
  public groupType?: string;
  public manufactureLocation?: string;
  public manufactureDate?: Date;

  public constructor(props: TestBridgeGroupProps, iModel: IModelDb) {
    super(props, iModel);
    this.groupType = props.groupType;
    this.manufactureLocation = props.manufactureLocation;
    this.manufactureDate = props.manufactureDate;
  }

  public override toJSON(): TestBridgeGroupProps {
    const val = super.toJSON() as TestBridgeGroupProps;
    val.groupType = this.groupType;
    val.manufactureDate = this.manufactureDate;
    val.manufactureLocation = this.manufactureLocation;
    return val;
  }

  public static createCode(iModelDb: IModelDb, scope: CodeScopeProps, codeValue: string): Code {
    const codeSpec: CodeSpec = iModelDb.codeSpecs.getByName(CodeSpecs.Group);
    return new Code({ spec: codeSpec.id, scope, value: codeValue });
  }
}

export interface TestBridgePhysicalProps extends PhysicalElementProps {
  condition?: string;
}

export interface TestBridgeGroupProps extends ElementProps {
  groupType?: string;
  manufactureLocation?: string;
  manufactureDate?: Date;
}
