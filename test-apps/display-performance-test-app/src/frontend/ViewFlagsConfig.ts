/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { assert } from "@itwin/core-bentley";
import { RenderMode, ViewFlagProps, ViewFlagsProperties } from "@itwin/core-common";

/** Selectively overrides individual ViewFlags for a TestConfig.
 * @note renderMode can be a string "wireframe", "hiddenline", "solidfill", or "smoothshade" (case-insensitive).
 */
export type ViewFlagsConfigProps = Partial<Omit<ViewFlagsProperties, "renderMode">> & { renderMode?: string | RenderMode };

type Remap = keyof Omit<ViewFlagProps, "renderMode"> | ((config: ViewFlagsConfigProps, props: ViewFlagProps) => void);

const remaps = new Map<keyof ViewFlagsConfigProps, Remap>([
  ["constructions", "noConstruct"],
  ["dimensions", "noDim"],
  ["patterns", "noPattern"],
  ["weights", "noWeight"],
  ["styles", "noStyle"],
  ["transparency", "noTransp"],
  ["fill", "noFill"],
  ["grid", "grid"],
  ["acsTriad", "acs"],
  ["textures", "noTexture"],
  ["materials", "noMaterial"],
  ["visibleEdges", "visEdges"],
  ["hiddenEdges", "hidEdges"],
  ["shadows", "shadows"],
  ["clipVolume", "clipVol"],
  ["monochrome", "monochrome"],
  ["backgroundMap", "backgroundMap"],
  ["ambientOcclusion", "ambientOcclusion"],
  ["thematicDisplay", "thematicDisplay"],
  ["forceSurfaceDiscard", "forceSurfaceDiscard"],
  ["whiteOnWhiteReversal", "noWhiteOnWhiteReversal"],
  ["contrastEdges", "contrastEdges"],
  ["edgeOverrides", "noEdgeOverrides"],
  ["monochromeEdges", "monochromeEdges"],
  ["visibleSurfaces", "noSurfaces"],
  ["backgroundSurfaceColor", "backgroundSurfaceColor"],
  ["transparencyThreshold", "transparencyThreshold"],
  ["lighting", (config, props) => props.noCameraLights = props.noSourceLights = props.noSolarLight = !config.lighting],
  ["renderMode", (config, props) => {
    let renderMode = config.renderMode!;
    if (typeof renderMode === "string") {
      switch (renderMode.toLowerCase()) {
        case "solidfill": renderMode = RenderMode.SolidFill; break;
        case "hiddenline": renderMode = RenderMode.HiddenLine; break;
        case "wireframe": renderMode = RenderMode.Wireframe; break;
        case "smoothshade": renderMode = RenderMode.SmoothShade; break;
      }
    }

    if (typeof renderMode !== "string")
      props.renderMode = renderMode;
  }],
]);

const propsStrings = {
  noDim: "-dim",
  noPattern: "-pat",
  noWeight: "-wt",
  noStyle: "-sty",
  noTransp: "-trn",
  noFill: "-fll",
  noTexture: "-txt",
  noMaterial: "-mat",
  visEdges: "+vsE",
  hidEdges: "+hdE",
  shadows: "+shd",
  clipVol: "-clp",
  noConstruct: "+con",
  monochrome: "+mno",
  backgroundMap: "+bkg",
  ambientOcclusion: "+ao",
  forceSurfaceDiscard: "+fsd",
  thematicDisplay: "+thematicDisplay",
  grid: "+grid",
  noWhiteOnWhiteReversal: "+wow",
  acs: "+acsTriad",
};

export namespace ViewFlagsConfig {
  export function toViewFlagProps(config: ViewFlagsConfigProps): ViewFlagProps {
    const props: ViewFlagProps = {};
    for (const propName of Object.keys(config)) {
      const key = propName as keyof ViewFlagsConfigProps;
      const remap = remaps.get(key);
      if (typeof remap === "string") {
        const value = config[key];
        assert(typeof value === "boolean");
        props[remap] = remap.startsWith("no") ? !value : value;
      } else if (remap) {
        remap(config, props);
      }
    }

    return props;
  }

  export function abbreviate(props: ViewFlagProps): string {
    let str = "";

    // Lighting flag always comes first.
    if (RenderMode.SmoothShade === props.renderMode && (!props.noSourceLights || !props.noCameraLights || !props.noSolarLight))
      str = "+lit";

    for (const propName of Object.keys(props)) {
      const key = propName as keyof typeof propsStrings;
      const abbrev = propsStrings[key];
      if (!abbrev)
        continue;

      assert("-" === abbrev[0] || "+" === abbrev[0]);
      const includeIf = "+" === abbrev[0];
      let value = props[key];
      if (key.startsWith("no"))
        value = !value;

      if (value === includeIf)
        str += abbrev;
    }

    return str;
  }
}
