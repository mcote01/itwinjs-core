/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module DisplayStyles
 */

// cspell:ignore ovrs

import { assert } from "@itwin/core-bentley";
import { JsonUtils, Mutable, NonFunctionPropertiesOf } from "@itwin/core-bentley";

/** Enumerates the available basic rendering modes, as part of a [DisplayStyle]($backend)'s [[ViewFlags]].
 * The rendering mode broadly affects various aspects of the display style - in particular, whether and how surfaces and their edges are drawn.
 * @public
 */
export enum RenderMode {
  /** Renders only the edges of surfaces, with exceptions for planar regions based on their [[FillFlags]].
   * Lighting (and by extension, shadows) is not applied.
   * [[HiddenLine.Settings]] are not applied - edges use the elements' width, style, and color.
   * [[ViewFlags.hiddenEdges]] is ignored - hidden edges are never displayed in wireframe mode.
   */
  Wireframe = 0,
  /** By default, renders surfaces without their edges.
   * Lighting and shadows can be applied using [[ViewFlags.lighting]] and [[ViewFlags.shadows]].
   * Edges can be enabled using [[ViewFlags.visibleEdges]] and [[ViewFlags.hiddenEdges]], and their appearance customized using [[HiddenLine.Settings]].
   * Surfaces can be drawn with transparency, based on [[ViewFlags.transparency]].
   */
  SmoothShade = 6,
  /** Renders surfaces and their edges. By default, edges are drawn in white; this can be overridden using [[HiddenLine.Settings]].
   * All surfaces are rendered opaque. If a surface's transparency is below that specified by [[HiddenLine.Settings.transparencyThreshold]], it is not rendered.
   * Materials and textures are not applied - surfaces are drawn in their actual colors.
   * [[ViewFlags.visibleEdges]] is ignored - visible edges are always drawn. Hidden edges can be enabled using [[ViewFlags.hiddenEdges]].
   * Lighting (and by extension, shadows) is not applied.
   */
  SolidFill = 4,
  /** Identical to [[RenderMode.SolidFill]], except:
   *  - Surfaces are drawn using the [DisplayStyle]($backend)'s background color.
   *  - Edges are drawn using their surface's colors; this can be overridden using [[HiddenLine.Settings]].
   */
  HiddenLine = 3,
}

const renderModeDefaults: Array<ViewFlagOverrides> = [];

renderModeDefaults[RenderMode.Wireframe] = {
  ambientOcclusion: false,
  backgroundSurfaceColor: false,
  contrastEdges: false,
  edgeOverrides: false,
  fill: true,
  lighting: false,
  materials: false,
  monochromeEdges: true,
  shadows: false,
  textures: false,
  transparencyThreshold: false,
  visibleEdges: true,
  visibleSurfaces: false,
};

renderModeDefaults[RenderMode.SolidFill] = {
  ambientOcclusion: false,
  backgroundSurfaceColor: false,
  contrastEdges: true,
  edgeOverrides: true,
  fill: true,
  lighting: false,
  materials: false,
  monochromeEdges: false,
  shadows: false,
  textures: false,
  transparency: false,
  transparencyThreshold: true,
  visibleEdges: true,
  visibleSurfaces: true,
};

renderModeDefaults[RenderMode.HiddenLine] = {
  ambientOcclusion: false,
  backgroundSurfaceColor: true,
  contrastEdges: false,
  edgeOverrides: true,
  fill: true,
  lighting: false,
  materials: false,
  monochromeEdges: false,
  shadows: false,
  textures: false,
  transparency: false,
  transparencyThreshold: true,
  visibleEdges: true,
  visibleSurfaces: true,
};

renderModeDefaults[RenderMode.SmoothShade] = {
  backgroundSurfaceColor: false,
  contrastEdges: false,
  edgeOverrides: true,
  fill: true,
  lighting: true,
  materials: true,
  monochromeEdges: false,
  textures: true,
  transparencyThreshold: false,
  visibleEdges: false,
  visibleSurfaces: true,
};

function getRenderModeDefaults(mode: RenderMode): ViewFlagOverrides {
  const flags = renderModeDefaults[mode];
  assert(undefined !== flags);
  return flags ?? { };
}

/** JSON representation of [[ViewFlags]].
 * This is a persistence format with some unfortunate quirks that have been retained for backwards compatibility.
 * In particular, it supplies three separate flags intended to control lighting - [[noCameraLights]], [[noSourceLights]], and [[noSolarLight]] -
 * but there exists only a single [[ViewFlags.lighting]] flag. [[ViewFlags.lighting]] is set to true unless all three of the "no lighting" flags are true.
 * It also uses awkward negative ([[noConstruct]], [[noTransp]]) and/or abbreviated ([[clipVol]], [[visEdges]]) property names that differ from
 * those of the corresponding [[ViewFlags]] properties, making usage of this type in code error-prone.
 * Prefer to use [[ViewFlagsProperties]] unless you need to work directly with the persistence format.
 * @public
 */
export interface ViewFlagProps {
  /** If true, don't display geometry of class [[GeometryClass.Construction]]. */
  noConstruct?: boolean;
  /** If true, don't display geometry of class [[GeometryClass.Dimension]]. */
  noDim?: boolean;
  /** If true, don't display geometry of class [[GeometryClass.Pattern]]. */
  noPattern?: boolean;
  /** If true, all lines are drawn with a width of 1 pixel. */
  noWeight?: boolean;
  /** If true, don't apply [[LinePixels]] styles. */
  noStyle?: boolean;
  /** If true, display transparency geometry as opaque. */
  noTransp?: boolean;
  /** If true, don't show filled planar regions, unless they use [[FillFlags.Always]]. */
  noFill?: boolean;
  /** If true, display a grid in the view. */
  grid?: boolean;
  /** If true, display graphics representing the [AuxCoordSystem]($backend). */
  acs?: boolean;
  /** If true, don't apply [[RenderTexture]]s to surfaces. */
  noTexture?: boolean;
  /** If true, don't apply [[RenderMaterial]]s to surfaces. */
  noMaterial?: boolean;
  /** @see [[ViewFlagProps]] for how this affects [[ViewFlags.lighting]]. */
  noCameraLights?: boolean;
  /** @see [[ViewFlagProps]] for how this affects [[ViewFlags.lighting]]. */
  noSourceLights?: boolean;
  /** @see [[ViewFlagProps]] for how this affects [[ViewFlags.lighting]]. */
  noSolarLight?: boolean;
  /** If true, display the edges of surfaces. */
  visEdges?: boolean;
  /** If true, display the edges of surfaces, even if they are behind other geometry. */
  hidEdges?: boolean;
  /** If true, display shadows. */
  shadows?: boolean;
  /** If true, apply the view's clipping volume. Has no effect on other types of clips like [[ModelClipGroups]]. */
  clipVol?: boolean;
  /** If true, apply the view's [[DisplayStyleSettings.monochromeColor]] and [[DisplayStyleSettings.monochromeMode]] to produce a monochrome image. */
  monochrome?: boolean;
  /** The basic rendering mode, which affects the behavior of other flags. */
  renderMode?: RenderMode;
  /** Display a background map. */
  backgroundMap?: boolean;
  /** If true, apply [[AmbientOcclusion]]. */
  ambientOcclusion?: boolean;
  /** If true, apply [[ThematicDisplay]]. */
  thematicDisplay?: boolean;
  /** Controls whether surface discard is always applied regardless of other ViewFlags.
   * Surface shaders contain complicated logic to ensure that the edges of a surface always draw in front of the surface, and that planar surfaces sketched coincident with
   * non-planar surfaces always draw in front of those non-planar surfaces.
   * When this view flag is set to false (the default), then for 3d views if the render mode is wireframe (only edges are displayed) or smooth shader with visible edges turned off (only surfaces are displayed),
   * that logic does not execute, potentially improving performance for no degradation in visual quality. In some scenarios - such as wireframe views containing many planar regions with interior fill, or smooth views containing many coincident planar and non-planar surfaces - enabling this view flag improves display quality by forcing that logic to execute.
   */
  forceSurfaceDiscard?: boolean;
  /** Disables the "white-on-white reversal" employed by some CAD applications.
   * @see [[ViewFlags.whiteOnWhiteReversal]].
   */
  noWhiteOnWhiteReversal?: boolean;

  ignoreRenderMode?: boolean;
  contrastEdges?: boolean;
  noEdgeOverrides?: boolean;
  monochromeEdges?: boolean;
  noSurfaces?: boolean;
  backgroundSurfaceColor?: boolean;
  transparencyThreshold?: boolean;
}

/** Flags controlling how graphics appear within a view.
 * A [[ViewFlags]] object is immutable. There are several ways to produce a modified copy of a ViewFlags object:
 * ```ts
 *  // Start with the default values for all properties.
 *  let vf = ViewFlags.defaults;
 *  // Change a single boolean property:
 *  vf = vf.with("visibleEdges", true);
 *  // Change only the render mode:
 *  vf = vf.withRenderMode(RenderMode.HiddenLine);
 *  // Change multiple properties:
 *  vf = vf.copy({ renderMode: RenderMode.SmoothShade, visibleEdges: true });
 *  // Reset multiple properties to their default values:
 *  vf = vf.copy({ renderMode: undefined, visibleEdges: undefined });
 *
 * ```
 * [[with]] and [[withRenderMode]] should be preferred if you only need to change a single property, as they will not create a new object unless
 * the new value differs from the current value.
 * [[copy]] and [[override]] should be preferred if you need to change multiple properties, as they will create no more than one new object, vs
 * each call to [[with]] or [[withRenderMode]] potentially creating a new object.
 * @see [[DisplayStyleSettings.viewFlags]] to define the view flags for a [DisplayStyle]($backend).
 * @public
 */
export class ViewFlags {
  /** Whether to display geometry of class [[GeometryClass.Dimension]]. Default: true. */
  public readonly dimensions: boolean;
  /** Whether to display geometry of class [[GeometryClass.Pattern]]. Default: true. */
  public readonly patterns: boolean;
  /** Whether to allow lines and edges to draw with width greater than one pixel. Default: true. */
  public readonly weights: boolean;
  /** Whether [[LinePixels]] are allowed to apply patterns to lines and edges. If false, they all draw as solid lines. Default: true. */
  public readonly styles: boolean;
  /** Whether element transparency is applied. If false, transparent geometry is drawn opaque. Default: true.
   * @see [[RenderMode]] for render mode-specific behavior.
   */
  public readonly transparency: boolean;
  /** In [[RenderMode.Wireframe]] only, whether to display the interiors of planar regions with [[FillFlags.ByView]]. Default: true. */
  public readonly fill: boolean;
  /** In [[RenderMode.SmoothShade]], whether to apply [[RenderTexture]]s to surfaces. Default: true. */
  public readonly textures: boolean;
  /** In [[RenderMode.SmoothShade]], whether to apply [[RenderMaterial]]s to surfaces. Default: true. */
  public readonly materials: boolean;
  /** Whether to display a graphical representation of the view's [AuxCoordSystem]($backend). Default: false. */
  public readonly acsTriad: boolean;
  /** Whether to display a grid. Default: false. */
  public readonly grid: boolean;
  /** In [[RenderMode.SmoothShade]], whether to display the edges of surfaces. Default: false.
   * @see [[HiddenLine.Settings]] to customize the appearance of the edges.
   */
  public readonly visibleEdges: boolean;
  /** In any mode except [[RenderMode.Wireframe]], whether to display the edges of surfaces occluded by other geometry.
   * This has no effect unless [[visibleEdges]] is also true.
   * Default: false.
   * @see [[HiddenLine.Settings]] to customize the appearance of the edges.
   */
  public readonly hiddenEdges: boolean;
  /** In [[RenderMode.SmoothShade]], whether to display solar shadows. This has no effect unless [[lighting]] is also true. Default: false.
   * @note Rendering shadows can reduce framerate, particularly on less capable graphics hardware or in complex scenes.
   */
  public readonly shadows: boolean;
  /** Whether to apply the view's clip volume to the geometry in the scene.
   * Default: true, except when using [[fromJSON]].
   * @see [[ViewDetails.clipVector]] to define the view's clip volume.
   */
  public readonly clipVolume: boolean;
  /** Whether to display geometry of class [[GeometryClass.Construction]].
   * Default: false, except when using [[fromJSON]].
   */
  public readonly constructions: boolean;
  /** Whether to produce a monochrome image. Default: false.
   * @see [DisplayStyleSettings.monochromeColor]($common) to define the monochrome color.
   * @see [DisplayStyleSettings.monochromeMode]($common) to define how the monochrome image is produced.
   */
  public readonly monochrome: boolean;
  /** Whether to display background map imagery. Default: false.
   * @see [[DisplayStyleSettings.backgroundMap]] to customize the map settings.
   */
  public readonly backgroundMap: boolean;
  /** In [[RenderMode.SmoothShade]], whether to apply [[AmbientOcclusion]]. Default: false. */
  public readonly ambientOcclusion: boolean;
  /** Whether to apply [[ThematicDisplay]]. Default: false. */
  public readonly thematicDisplay: boolean;
  /** Controls whether surface discard is always applied regardless of other ViewFlags.
   * Surface shaders contain complicated logic to ensure that the edges of a surface always draw in front of the surface, and that planar surfaces sketched coincident with
   * non-planar surfaces always draw in front of those non-planar surfaces.
   * When this view flag is set to false (the default), then for 3d views if the render mode is wireframe (only edges are displayed) or smooth shader with visible edges turned off (only surfaces are displayed),
   * that logic does not execute, potentially improving performance for no degradation in visual quality. In some scenarios - such as wireframe views containing many planar regions with interior fill, or smooth views containing many coincident planar and non-planar surfaces - enabling this view flag improves display quality by forcing that logic to execute.
   */
  public readonly forceSurfaceDiscard: boolean;
  /** Whether to apply white-on-white reversal.
   * Some CAD applications use this to cause white geometry to be drawn as black if the view's background color is white.
   * When enabled, the [[DisplayStyleSettings]]' [[WhiteOnWhiteReversalSettings]] control how white-on-white reversal is applied.
   * Default: true.
   */
  public readonly whiteOnWhiteReversal: boolean;

  /** In [[RenderMode.SmoothShade]], whether to apply lighting to surfaces.
   * Default: true.
   * @see [[DisplayStyleSettings.lights]] to customize the light settings.
   */
  public readonly lighting: boolean;

  public readonly contrastEdges: boolean;

  public readonly edgeOverrides: boolean;

  public readonly monochromeEdges: boolean;

  public readonly visibleSurfaces: boolean;

  public readonly backgroundSurfaceColor: boolean;

  public readonly transparencyThreshold: boolean;

  private constructor(flags: Partial<ViewFlagsProperties>) {
    this.dimensions = flags.dimensions ?? true;
    this.patterns = flags.patterns ?? true;
    this.weights = flags.weights ?? true;
    this.styles = flags.styles ?? true;
    this.transparency = flags.transparency ?? true;
    this.fill = flags.fill ?? true;
    this.textures = flags.textures ?? true;
    this.materials = flags.materials ?? true;
    this.acsTriad = flags.acsTriad ?? false;
    this.grid = flags.grid ?? false;
    this.visibleEdges = flags.visibleEdges ?? false;
    this.hiddenEdges = flags.hiddenEdges ?? false;
    this.shadows = flags.shadows ?? false;
    this.clipVolume = flags.clipVolume ?? true;
    this.constructions = flags.constructions ?? false;
    this.monochrome = flags.monochrome ?? false;
    this.backgroundMap = flags.backgroundMap ?? false;
    this.ambientOcclusion = flags.ambientOcclusion ?? false;
    this.thematicDisplay = flags.thematicDisplay ?? false;
    this.forceSurfaceDiscard = flags.forceSurfaceDiscard ?? false;
    this.whiteOnWhiteReversal = flags.whiteOnWhiteReversal ?? true;
    this.lighting = flags.lighting ?? true;

    this.contrastEdges = flags.contrastEdges ?? false;
    this.edgeOverrides = flags.edgeOverrides ?? true;
    this.monochromeEdges = flags.monochromeEdges ?? false;
    this.visibleSurfaces = flags.visibleSurfaces ?? true;
    this.backgroundSurfaceColor = flags.backgroundSurfaceColor ?? false;
    this.transparencyThreshold = flags.transparencyThreshold ?? false;
  }

  /** Produce a copy of these ViewFlags with some modified properties. Any properties not explicitly specified by `changedFlags` will retain their current values.
   * @param changedFlags Properties to modify.
   * @returns A copy of these ViewFlags modified according to the supplied properties.
   * @note Any explicitly `undefined` property of `changedFlags` will be set to its default value in the returned ViewFlags.
   * @see [[override]] to have `undefined` properties retain their current values.
   */
  public copy(changedFlags: Partial<ViewFlagsProperties>): ViewFlags {
    return JsonUtils.isNonEmptyObject(changedFlags) ? new ViewFlags({ ...this, ...changedFlags }) : this;
  }

  /** Produce a copy of these ViewFlags, overriding some of its properties. Any properties not explicitly specified by `overrides` will retain their current values,
   * as will any property explicitly set to `undefined`.
   * @param overrides The properties to override.
   * @see [[copy]] to have `undefined` properties reset to their default values.
   */
  public override(overrides: Partial<ViewFlagsProperties>): ViewFlags {
    // Create a copy of the input with all undefined ViewFlags properties removed.
    // Note we use the keys of an actual ViewFlags object instead of those of the input to avoid processing additional unrelated properties that may be present on input.
    overrides = { ...overrides };
    for (const propName of Object.keys(ViewFlags.fromRenderMode(RenderMode.Wireframe))) {
      const key = propName as keyof Partial<ViewFlagsProperties>;
      if (undefined === overrides[key])
        delete overrides[key];
    }

    return this.copy(overrides);
  }

  /** Produce a copy of these ViewFlags with a single boolean property changed.
   * @param flag The name of the property.
   * @param value The value to change the property to.
   * @returns A new ViewFlags with the property changed as specified, or `this` if the property already has the specified value.
   * @see [[withRenderMode]] to change the [[renderMode]] property.
   * @see [[copy]] and [[override]] to change multiple properties.
   */
  public with(flag: keyof ViewFlagsProperties, value: boolean): ViewFlags {
    assert("renderMode" !== flag);
    if (this[flag] === value)
      return this;

    const props: ViewFlagsProperties = { ...this };
    props[flag] = value;
    return new ViewFlags(props);
  }

  /** Produce a copy of these ViewFlags with a different [[renderMode]].
   * @param renderMode The new render mode.
   * @returns A new ViewFlags with the render mode changed as specified, or `this` if the render mode is already set to the requested value.
   * @see [[copy]] and [[override]] to change multiple properties.
   */
  public withRenderMode(renderMode: RenderMode, props?: ViewFlagOverrides): ViewFlags {
    // This resets any property that has a default for the specified render mode to that default.
    // So, for example, if you turn off transparency and turn on visible edges, then switch to SmoothShade, edges will be disabled and transparency enabled.
    const defs = getRenderModeDefaults(renderMode);
    props = props ? { ...defs, ...props } : defs;
    return this.copy(props);
  }

  /** @internal */
  public hiddenEdgesVisible(): boolean {
    return this.visibleEdges && this.hiddenEdges;
  }

  /** Convert to JSON representation. */
  public toJSON(): ViewFlagProps {
    const out: ViewFlagProps = {};

    if (!this.constructions) out.noConstruct = true;
    if (!this.dimensions) out.noDim = true;
    if (!this.patterns) out.noPattern = true;
    if (!this.weights) out.noWeight = true;
    if (!this.styles) out.noStyle = true;
    if (!this.transparency) out.noTransp = true;
    if (!this.fill) out.noFill = true;
    if (this.grid) out.grid = true;
    if (this.acsTriad) out.acs = true;
    if (!this.textures) out.noTexture = true;
    if (!this.materials) out.noMaterial = true;
    if (!this.lighting) out.noCameraLights = out.noSourceLights = out.noSolarLight = true;
    if (this.visibleEdges) out.visEdges = true;
    if (this.hiddenEdges) out.hidEdges = true;
    if (this.shadows) out.shadows = true;
    if (this.clipVolume) out.clipVol = true;
    if (this.monochrome) out.monochrome = true;
    if (this.backgroundMap) out.backgroundMap = true;
    if (this.ambientOcclusion) out.ambientOcclusion = true;
    if (this.thematicDisplay) out.thematicDisplay = true;
    if (this.forceSurfaceDiscard) out.forceSurfaceDiscard = true;
    if (!this.whiteOnWhiteReversal) out.noWhiteOnWhiteReversal = true;

    if (this.contrastEdges) out.contrastEdges = true;
    if (!this.edgeOverrides) out.noEdgeOverrides = true;
    if (this.monochromeEdges) out.monochromeEdges = true;
    if (!this.visibleSurfaces) out.noSurfaces = true;
    if (this.backgroundSurfaceColor) out.backgroundSurfaceColor = true;
    if (this.transparencyThreshold) out.transparencyThreshold = true;

    // For backwards compatibility, determine a closest match for RenderMode.
    // Also set a flag indicating we should ignore this RenderMode when reinstantiating from JSON.
    out.renderMode = this.getClosestRenderMode();
    out.ignoreRenderMode = true;

    return out;
  }

  public getClosestRenderMode(): RenderMode {
    if (this.visibleEdges) {
      if (!this.visibleSurfaces)
        return RenderMode.Wireframe;
      else if (this.backgroundSurfaceColor)
        return RenderMode.HiddenLine;
      else if (this.contrastEdges && !this.lighting && !this.materials && !this.textures)
        return RenderMode.SolidFill;
    }

    return RenderMode.SmoothShade;
  }

  /** Like [[toJSON]], but no properties are omitted.
   * @internal
   */
  public toFullyDefinedJSON(): Required<ViewFlagProps> {
    return {
      renderMode: this.getClosestRenderMode(),
      ignoreRenderMode: true,

      noConstruct: !this.constructions,
      noDim: !this.dimensions,
      noPattern: !this.patterns,
      noWeight: !this.weights,
      noStyle: !this.styles,
      noTransp: !this.transparency,
      noFill: !this.fill,
      grid: this.grid,
      acs: this.acsTriad,
      noTexture: !this.textures,
      noMaterial: !this.materials,
      noCameraLights: !this.lighting,
      noSourceLights: !this.lighting,
      noSolarLight: !this.lighting,
      visEdges: this.visibleEdges,
      hidEdges: this.hiddenEdges,
      shadows: this.shadows,
      clipVol: this.clipVolume,
      monochrome: this.monochrome,
      backgroundMap: this.backgroundMap,
      ambientOcclusion: this.ambientOcclusion,
      thematicDisplay: this.thematicDisplay,
      forceSurfaceDiscard: this.forceSurfaceDiscard,
      noWhiteOnWhiteReversal: !this.whiteOnWhiteReversal,

      contrastEdges: this.contrastEdges,
      noEdgeOverrides: !this.edgeOverrides,
      monochromeEdges: this.monochromeEdges,
      noSurfaces: !this.visibleSurfaces,
      backgroundSurfaceColor: this.backgroundSurfaceColor,
      transparencyThreshold: this.transparencyThreshold,
    };
  }

  /** Create a ViewFlags.
   * @param flags The properties to initialize. Any properties not specified are initialized to their default values.
   */
  public static create(flags?: Partial<ViewFlagsProperties>): ViewFlags {
    return flags && !JsonUtils.isEmptyObject(flags) ? new ViewFlags(flags) : this.fromRenderMode(RenderMode.SmoothShade);
  }

  /** Create a ViewFlags from its JSON representation.
   * @note As described in [[ViewFlagProps]], the JSON representation is awkward and error-prone. Prefer to use [[create]] unless you
   * need to deal with the persistence format directly.
   * @note The default values differ slightly from those used by the constructor and [[create]]:
   *  - [[clipVolume]] defaults to false.
   *  - [[constructions]] defaults to true.
   *  - [[lighting]] defaults to true for RenderMode.SmoothShade unless ignoreRenderMode is true or all of [[ViewFlagProps.noSolarLight]],
   *    [[ViewFlagProps.noCameraLights]], and [[ViewFlagProps.noSourceLights]] are true.
   */
  public static fromJSON(json?: ViewFlagProps): ViewFlags {
    if (!json)
      return this.fromRenderMode(RenderMode.Wireframe);

    let renderMode: RenderMode | undefined;
    if (!json.ignoreRenderMode) {
      const renderModeValue = JsonUtils.asInt(json.renderMode);
      if (renderModeValue < RenderMode.HiddenLine)
        renderMode = RenderMode.Wireframe;
      else if (renderModeValue > RenderMode.SolidFill)
        renderMode = RenderMode.SmoothShade;
      else
        renderMode = renderModeValue;
    }

    const defaults = undefined !== renderMode ? getRenderModeDefaults(renderMode) : { };

    const props = {
      constructions: !JsonUtils.asBool(json.noConstruct),
      dimensions: !JsonUtils.asBool(json.noDim),
      patterns: !JsonUtils.asBool(json.noPattern),
      weights: !JsonUtils.asBool(json.noWeight),
      styles: !JsonUtils.asBool(json.noStyle),
      grid: JsonUtils.asBool(json.grid),
      acsTriad: JsonUtils.asBool(json.acs),
      hiddenEdges: JsonUtils.asBool(json.hidEdges),
      clipVolume: JsonUtils.asBool(json.clipVol),
      monochrome: JsonUtils.asBool(json.monochrome),
      backgroundMap: JsonUtils.asBool(json.backgroundMap),
      thematicDisplay: JsonUtils.asBool(json.thematicDisplay),
      forceSurfaceDiscard: JsonUtils.asBool(json.forceSurfaceDiscard),
      whiteOnWhiteReversal: !JsonUtils.asBool(json.noWhiteOnWhiteReversal),

      contrastEdges: JsonUtils.asBool(json.contrastEdges),
      edgeOverrides: !JsonUtils.asBool(json.noEdgeOverrides),
      monochromeEdges: JsonUtils.asBool(json.monochromeEdges),
      visibleSurfaces: !JsonUtils.asBool(json.noSurfaces),
      backgroundSurfaceColor: JsonUtils.asBool(json.backgroundSurfaceColor),
      transparencyThreshold: JsonUtils.asBool(json.transparencyThreshold),

      ...defaults,
    };

    // Some flags have defaults specific to a render mode but can be overridden.
    if (!json.ignoreRenderMode) {
      switch (renderMode) {
        case RenderMode.Wireframe:
          if (JsonUtils.asBool(json.noFill))
            props.fill = false;
          if (JsonUtils.asBool(json.noTransp))
            props.transparency = false;
          break;
        case RenderMode.SmoothShade:
          if (JsonUtils.asBool(json.noTexture))
            props.textures = false;
          if (JsonUtils.asBool(json.noMaterial))
            props.materials = false;
          if (JsonUtils.asBool(json.visEdges))
            props.visibleEdges = true;
          if (JsonUtils.asBool(json.ambientOcclusion))
            props.ambientOcclusion = true;
          if (JsonUtils.asBool(json.shadows))
            props.shadows = true;
          if (JsonUtils.asBool(json.noCameraLights) && JsonUtils.asBool(json.noSourceLights) && JsonUtils.asBool(json.noSolarLight))
            props.lighting = false;

          break;
      }
    } else {
      props.fill = !JsonUtils.asBool(json.noFill);
      props.transparency = !JsonUtils.asBool(json.noTransp);
      props.textures = !JsonUtils.asBool(json.noTexture);
      props.materials = !JsonUtils.asBool(json.noMaterial);
      props.visibleEdges = JsonUtils.asBool(json.visEdges);
      props.ambientOcclusion = JsonUtils.asBool(json.ambientOcclusion);
      props.shadows = JsonUtils.asBool(json.shadows);
      props.lighting = !JsonUtils.asBool(json.noCameraLights) || !JsonUtils.asBool(json.noSourceLights) || !JsonUtils.asBool(json.noSolarLight);
    }

    return new ViewFlags(props);
  }

  public static get wireframe(): ViewFlags { return this.fromRenderMode(RenderMode.Wireframe); }
  public static get smoothShaded(): ViewFlags { return this.fromRenderMode(RenderMode.SmoothShade); }
  public static get solidFill(): ViewFlags { return this.fromRenderMode(RenderMode.SolidFill); }
  public static get hiddenLine(): ViewFlags { return this.fromRenderMode(RenderMode.HiddenLine); }

  public static fromRenderMode(renderMode: RenderMode, props?: ViewFlagOverrides): ViewFlags {
    if (!props) {
      const flags = flagsByRenderMode[renderMode];
      assert(undefined !== flags, "Invalid RenderMode in ViewFlags.fromRenderMode");
      return flags ?? flagsByRenderMode[RenderMode.Wireframe];
    }

    const def = getRenderModeDefaults(renderMode);
    props = props ? { ...def, ...props } : def;
    return this.create(props);
  }

  /** Returns true if `this` and `other` are equivalent. */
  public equals(other: Readonly<ViewFlagsProperties>): boolean {
    if (this === other)
      return true;

    return this.dimensions === other.dimensions
      && this.patterns === other.patterns
      && this.weights === other.weights
      && this.styles === other.styles
      && this.transparency === other.transparency
      && this.fill === other.fill
      && this.textures === other.textures
      && this.materials === other.materials
      && this.acsTriad === other.acsTriad
      && this.grid === other.grid
      && this.visibleEdges === other.visibleEdges
      && this.hiddenEdges === other.hiddenEdges
      && this.lighting === other.lighting
      && this.shadows === other.shadows
      && this.clipVolume === other.clipVolume
      && this.constructions === other.constructions
      && this.monochrome === other.monochrome
      && this.backgroundMap === other.backgroundMap
      && this.ambientOcclusion === other.ambientOcclusion
      && this.thematicDisplay === other.thematicDisplay
      && this.forceSurfaceDiscard === other.forceSurfaceDiscard
      && this.whiteOnWhiteReversal === other.whiteOnWhiteReversal
      && this.contrastEdges === other.contrastEdges
      && this.edgeOverrides === other.edgeOverrides
      && this.monochromeEdges === other.monochromeEdges
      && this.visibleSurfaces === other.visibleSurfaces
      && this.backgroundSurfaceColor === other.backgroundSurfaceColor
      && this.transparencyThreshold === other.transparencyThreshold;
  }
}

const flagsByRenderMode: Array<ViewFlags> = [];
[RenderMode.Wireframe, RenderMode.SolidFill, RenderMode.HiddenLine, RenderMode.SmoothShade].forEach((x) => flagsByRenderMode[x] = ViewFlags.create(getRenderModeDefaults(x)));

/** A type containing all of the properties of [[ViewFlags]] with none of the methods and with the `readonly` modifiers removed.
 * @see [[ViewFlags.create]], [[ViewFlags.copy]], and [[ViewFlags.override]] for methods accepting an object of this type.
 * @public
 */
export type ViewFlagsProperties = Mutable<NonFunctionPropertiesOf<ViewFlags>> & { renderMode?: never };

/** A type that describes how to override selected properties of a [[ViewFlags]].
 * @see [[ViewFlags.override]] to apply the overrides to a ViewFlags object.
 * @public
 */
export type ViewFlagOverrides = Partial<ViewFlagsProperties>;
