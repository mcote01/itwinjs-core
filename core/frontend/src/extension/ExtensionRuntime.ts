/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

/* eslint-disable @typescript-eslint/naming-convention */

import { AccuDrawHintBuilder, ContextRotationId } from "../AccuDraw";
import { ACSDisplayOptions, ACSType } from "../AuxCoordSys";
import { CoordSystem } from "../CoordSystem";
import { LocateAction, LocateFilterStatus, LocateResponse, SnapStatus } from "../ElementLocateManager";
import { FlashMode } from "../FlashSettings";
import { FrontendLoggerCategory } from "../FrontendLoggerCategory";
import { HitDetailType, HitGeomType, HitParentGeomType, HitPriority, HitSource, SnapHeat, SnapMode } from "../HitDetail";
import { ActivityMessageEndReason, MessageBoxIconType, MessageBoxType, MessageBoxValue, NotifyMessageDetails, OutputMessageAlert, OutputMessagePriority, OutputMessageType } from "../NotificationManager";
import { SelectionSetEventType } from "../SelectionSet";
import { StandardViewId } from "../StandardView";
import { ViewRect } from "../ViewRect";
import { ViewStatus } from "../ViewStatus";
import { DepthPointSource, ViewUndoEvent } from "../Viewport";
import { GraphicType } from "../render/GraphicBuilder";
import { Pixel } from "../render/Pixel";
import { TextureTransparency } from "../render/RenderTexture";
import { UniformType, VaryingType } from "../render/ScreenSpaceEffectBuilder";
import { TileBoundingBoxes, TileGraphicType, TileLoadPriority, TileLoadStatus, TileTreeLoadStatus, TileVisibility } from "../tile/internal";
import { ClipEventType } from "../tools/ClipViewTool";
import { PrimitiveTool } from "../tools/PrimitiveTool";
import { SelectionMethod, SelectionMode, SelectionProcessing } from "../tools/SelectTool";
import { BeButton, BeButtonEvent, BeModifierKeys, CoordinateLockOverrides, CoordSource, EventHandled, InputSource, InteractiveTool, KeyinParseError, ParseAndRunResult, Tool } from "../tools/Tool";
import { ManipulatorToolEvent, StartOrResume } from "../tools/ToolAdmin";
import { ToolAssistance, ToolAssistanceImage, ToolAssistanceInputMethod } from "../tools/ToolAssistance";
import { ViewTool } from "../tools/ViewTool";
import { EditManipulator } from "../tools/EditManipulator";
import { EmphasizeElements } from "../EmphasizeElements";
import { FeatureSymbology } from "../render/FeatureSymbology";
import { GraphicBranch } from "../render/GraphicBranch";

import {
  BackgroundFill, BackgroundMapType, BatchType, BisCodeSpec, BriefcaseIdValue, ChangedValueState, ChangeOpCode, ChangesetType, ColorByName, ColorDef, CommonLoggerCategory,
  ECSqlSystemProperty, ECSqlValueType, ElementGeometryOpcode, FeatureOverrideType, FillDisplay, FillFlags, FontType, GeoCoordStatus, GeometryClass, GeometryStreamFlags,
  GeometrySummaryVerbosity, GlobeMode, GridOrientationType, HSVConstants, ImageBufferFormat, ImageSourceFormat, LinePixels, MassPropertiesOperation, MonochromeMode,
  Npc, PlanarClipMaskMode, PlanarClipMaskPriority, QueryRowFormat, Rank, RenderMode, RpcContentType, RpcEndpoint, RpcProtocolEvent, RpcRequestEvent, RpcRequestStatus,
  RpcResponseCacheControl, SectionType, SkyBoxImageType, SpatialClassifierInsideDisplay, SpatialClassifierOutsideDisplay, SyncMode, TerrainHeightOriginMode,
  TextureMapUnits, ThematicDisplayMode, ThematicGradientColorScheme, ThematicGradientMode, TxnAction, TypeOfChange,
} from "@itwin/core-common";
import { ExtensionImpl } from "./ExtensionImpl";
import { ExtensionHost } from "./ExtensionHost";

const globalSymbol = Symbol.for("itwin.core.frontend.globals");
if ((globalThis as any)[globalSymbol])
  throw new Error("Multiple @itwin/core-frontend imports detected!");

const getExtensionApi = (id: string) => {
  return {
    exports: {
      InteractiveTool, PrimitiveTool, ViewTool, Tool,

      ToolAssistance, BeButtonEvent, ViewRect, Pixel, LocateResponse, EditManipulator, AccuDrawHintBuilder, EmphasizeElements, FeatureSymbology, GraphicBranch, NotifyMessageDetails,

      ColorDef,

      ExtensionHost,

      ACSDisplayOptions, ACSType, ActivityMessageEndReason, BeButton, BeModifierKeys, ClipEventType, ContextRotationId, CoordinateLockOverrides,
      CoordSource, CoordSystem, DepthPointSource, EventHandled, FlashMode, FrontendLoggerCategory, GraphicType, HitDetailType, HitGeomType,
      HitParentGeomType, HitPriority, HitSource, InputSource, KeyinParseError, LocateAction, LocateFilterStatus, ManipulatorToolEvent,
      MessageBoxIconType, MessageBoxType, MessageBoxValue, OutputMessageAlert, OutputMessagePriority, OutputMessageType, ParseAndRunResult,
      SelectionMethod, SelectionMode, SelectionProcessing, SelectionSetEventType, SnapHeat, SnapMode, SnapStatus, StandardViewId, StartOrResume,
      TextureTransparency, TileBoundingBoxes, TileGraphicType, TileLoadPriority, TileLoadStatus, TileTreeLoadStatus, TileVisibility,
      ToolAssistanceImage, ToolAssistanceInputMethod, UniformType, VaryingType, ViewStatus, ViewUndoEvent,

      BackgroundFill, BackgroundMapType, BatchType, BisCodeSpec, BriefcaseIdValue, ChangedValueState, ChangeOpCode, ChangesetType, ColorByName,
      CommonLoggerCategory, ECSqlSystemProperty, ECSqlValueType, ElementGeometryOpcode, FeatureOverrideType, FillDisplay, FillFlags, FontType,
      GeoCoordStatus, GeometryClass, GeometryStreamFlags, GeometrySummaryVerbosity, GlobeMode, GridOrientationType, HSVConstants, ImageBufferFormat,
      ImageSourceFormat, LinePixels, MassPropertiesOperation, MonochromeMode, Npc, PlanarClipMaskMode, PlanarClipMaskPriority, QueryRowFormat, Rank,
      RenderMode, RpcContentType, RpcEndpoint, RpcProtocolEvent, RpcRequestEvent, RpcRequestStatus, RpcResponseCacheControl, SectionType,
      SkyBoxImageType, SpatialClassifierInsideDisplay, SpatialClassifierOutsideDisplay, SyncMode, TerrainHeightOriginMode, TextureMapUnits,
      ThematicDisplayMode, ThematicGradientColorScheme, ThematicGradientMode, TxnAction, TypeOfChange,
    },
    api: new ExtensionImpl(id),
  };
};

(globalThis as any)[globalSymbol] = {
  getExtensionApi,
};
