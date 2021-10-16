/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { assert, expect } from "chai";
import {
  RenderMode, ViewFlagOverrides, ViewFlagProps, ViewFlags, ViewFlagsProperties,
} from "../ViewFlags";

function invertDefaults(): ViewFlags {
  const invertedProperties: Partial<ViewFlagsProperties> = { };
  for (const propname of Object.keys(ViewFlags.defaults)) {
    const key = propname as keyof ViewFlags;
    const value = ViewFlags.defaults[key];
    if (typeof value === "boolean")
      (invertedProperties as any)[key] = !value;
  }

  return ViewFlags.create(invertedProperties);
}

describe("ViewFlags", () => {
  it("should initialize to expected defaults", () => {
    const flags = ViewFlags.create();
    assert(flags.acsTriad === false);
    assert(flags.grid === false);
    assert(flags.fill === true);
    assert(flags.getClosestRenderMode() === RenderMode.Wireframe);
  });

  it("initializes from render mode", () => {
    for (const mode of [RenderMode.Wireframe, RenderMode.HiddenLine, RenderMode.SmoothShade, RenderMode.SolidFill]) {
      const vf = ViewFlags.fromRenderMode(mode);
      expect(vf.getClosestRenderMode()).to.equal(mode);

      const json = vf.toJSON();
      expect(json.renderMode).to.equal(mode);

      const vf2 = ViewFlags.fromJSON(json);
      expect(vf2.getClosestRenderMode()).to.equal(mode);
      expect(vf2.toJSON()).to.deep.equal(json);
      expect(vf2.equals(vf)).to.be.true;
    }
  });

  it("should round-trip through JSON", () => {
    const roundTrip = (input: ViewFlagProps | undefined, expected: ViewFlagProps | "input") => {
      if ("input" === expected)
        expected = input ?? { };

      const vf = ViewFlags.fromJSON(input);
      const output = vf.toJSON();
      expect(output).to.deep.equal(expected);

      const fullOutput = vf.toFullyDefinedJSON();
      for (const key of Object.keys(output) as Array<keyof ViewFlagProps>)
        expect(fullOutput[key]).to.equal(output[key]);
    };

    roundTrip({ }, {
      renderMode: RenderMode.Wireframe,
      ignoreRenderMode: true,
      monochromeEdges: true,
      noEdgeOverrides: true,
      noMaterial: true,
      noTexture: true,
      noSolarLight: true,
      noSourceLights: true,
      noCameraLights: true,
      noSurfaces: true,
      visEdges: true,
    });

    roundTrip({ acs: true, monochrome: true, renderMode: RenderMode.Wireframe }, {
      acs: true,
      monochrome: true,
      renderMode: RenderMode.Wireframe,
      ignoreRenderMode: true,
      monochromeEdges: true,
      noEdgeOverrides: true,
      noMaterial: true,
      noTexture: true,
      noSolarLight: true,
      noSourceLights: true,
      noCameraLights: true,
      noSurfaces: true,
      visEdges: true,
    });

    roundTrip({ acs: false, monochrome: false, renderMode: RenderMode.SmoothShade }, {
      renderMode: RenderMode.SmoothShade,
      ignoreRenderMode: true,
      noFill: true,
    });

    const makeViewFlags = (on: boolean) => {
      const vfProps: Required<ViewFlagProps> = {
        noConstruct: on,
        noDim: on,
        noPattern: on,
        noWeight: on,
        noStyle: on,
        noTransp: on,
        noFill: on,
        grid: on,
        acs: on,
        noTexture: on,
        noMaterial: on,
        noCameraLights: on,
        noSourceLights: on,
        noSolarLight: on,
        visEdges: on,
        hidEdges: on,
        shadows: on,
        clipVol: on,
        monochrome: on,
        backgroundMap: on,
        ambientOcclusion: on,
        thematicDisplay: on,
        forceSurfaceDiscard: on,
        noWhiteOnWhiteReversal: on,
        renderMode: RenderMode.Wireframe,

        ignoreRenderMode: true,
        contrastEdges: on,
        noEdgeOverrides: on,
        monochromeEdges: on,
        noSurfaces: on,
        backgroundSurfaceColor: on,
        transparencyThreshold: on,
      };

      return vfProps;
    };

    roundTrip(makeViewFlags(true), "input");

    const defaults = {
      clipVol: true,
      noCameraLights: true,
      noConstruct: true,
      noSolarLight: true,
      noSourceLights: true,
      renderMode: RenderMode.Wireframe,
      ignoreRenderMode: true,
      noSurfaces: true,
      visEdges: true,
      monochromeEdges: true,
      noEdgeOverrides: true,
      noMaterial: true,
      noTexture: true,
    };

    roundTrip(undefined, defaults);
    roundTrip(ViewFlags.create().toJSON(), defaults);

    roundTrip(invertDefaults().toJSON(), {
      noDim: true,
      noPattern: true,
      noWeight: true,
      noStyle: true,
      noTransp: true,
      noFill: true,
      grid: true,
      acs: true,
      hidEdges: true,
      shadows: true,
      monochrome: true,
      renderMode: RenderMode.SmoothShade,
      ambientOcclusion: true,
      thematicDisplay: true,
      backgroundMap: true,
      forceSurfaceDiscard: true,
      noWhiteOnWhiteReversal: true,
      ignoreRenderMode: true,
      transparencyThreshold: true,
      backgroundSurfaceColor: true,
      contrastEdges: true,
    });
  });

  it("should initialize visibleEdges based on render mode and flag", () => {
    for (const renderMode of [RenderMode.Wireframe, RenderMode.HiddenLine, RenderMode.SolidFill, RenderMode.SmoothShade]) {
      expect(ViewFlags.fromRenderMode(renderMode).visibleEdges).to.equal(RenderMode.SmoothShade !== renderMode);
      expect(ViewFlags.fromRenderMode(renderMode, { visibleEdges: true }).visibleEdges).to.be.true;
      expect(ViewFlags.fromRenderMode(renderMode, { visibleEdges: false }).visibleEdges).to.be.false;

      // Undefined means "use default", which is false for visible edges.
      expect(ViewFlags.fromRenderMode(renderMode, { visibleEdges: undefined }).visibleEdges).to.be.false;
    }
  });

  it("copies", () => {
    const def = ViewFlags.defaults;
    expect(def.copy({})).to.deep.equal(def);

    const inv = invertDefaults();
    expect(def.copy(inv)).to.deep.equal(inv);
    expect(inv.copy(def)).to.deep.equal(def);

    expect(inv.copy({ ...inv, transparency: undefined })).to.deep.equal({ ...inv, transparency: true });
  });

  it("overrides", () => {
    const def = ViewFlags.defaults;
    expect(def.override({})).to.deep.equal(def);

    const inv = invertDefaults();
    expect(def.override(inv)).to.deep.equal(inv);
    expect(inv.override(def)).to.deep.equal(def);

    expect(inv.override({ ...inv, transparency: undefined })).to.deep.equal(inv);
  });

  it("returns defaults if no properties supplied", () => {
    expect(ViewFlags.fromJSON()).to.equal(ViewFlags.defaults);
    expect(ViewFlags.create()).to.equal(ViewFlags.defaults);
    expect(ViewFlags.create({ })).to.equal(ViewFlags.defaults);
  });

  it("uses different defaults for undefined vs ViewFlagProps", () => {
    const def = ViewFlags.defaults;
    expect(ViewFlags.fromJSON(undefined)).to.deep.equal(def);

    expect(ViewFlags.fromJSON({ })).to.deep.equal({
      ...def,
      clipVolume: !def.clipVolume,
      constructions: !def.constructions,
    });
  });

  it("has 3 JSON properties corresponding to 1 lighting flag", () => {
    function expectLighting(vf: ViewFlags, expected: boolean) {
      expect(vf.lighting).to.equal(expected);
      const props = vf.toJSON();
      const prop = expected ? undefined : true;
      expect(props.noSolarLight).to.equal(prop);
      expect(props.noCameraLights).to.equal(prop);
      expect(props.noSourceLights).to.equal(prop);
      expect(ViewFlags.fromJSON(props).lighting).to.equal(expected);
    }

    expectLighting(ViewFlags.fromJSON(), false);
    expectLighting(ViewFlags.fromJSON({}), false);
    expectLighting(ViewFlags.fromJSON({ renderMode: RenderMode.SmoothShade, noSourceLights: true, noCameraLights: true, noSolarLight: true }), false);
    expectLighting(ViewFlags.fromJSON({ renderMode: RenderMode.SmoothShade, noCameraLights: true, noSolarLight: true }), true);
    expectLighting(ViewFlags.fromJSON({ renderMode: RenderMode.SmoothShade, noCameraLights: true }), true);

    expectLighting(ViewFlags.create(), false);
    expectLighting(ViewFlags.create({ lighting: false }), false);
    expectLighting(ViewFlags.create({ lighting: true }), true);

    expectLighting(ViewFlags.fromRenderMode(RenderMode.Wireframe), false);
    expectLighting(ViewFlags.fromRenderMode(RenderMode.SolidFill), false);
    expectLighting(ViewFlags.fromRenderMode(RenderMode.HiddenLine), false);
    expectLighting(ViewFlags.fromRenderMode(RenderMode.SmoothShade), true);
  });

  it("constructs from self", () => {
    expect(ViewFlags.defaults.equals(ViewFlags.create(ViewFlags.defaults))).to.be.true;
    expect(ViewFlags.fromJSON(ViewFlags.defaults.toJSON()).toJSON()).to.deep.equal(ViewFlags.defaults.toJSON());
    expect(ViewFlags.fromJSON(ViewFlags.defaults.toJSON()).equals(ViewFlags.defaults)).to.be.true;
  });

  it("with", () => {
    const def = ViewFlags.defaults;
    for (const propName of Object.keys(def)) {
      const key = propName as keyof Omit<ViewFlagsProperties, "renderMode">;
      const value = def[key];
      if (typeof value !== "boolean")
        continue;

      expect(def.with(key, value)).to.equal(def);
      expect(def.with(key, !value)[key]).to.equal(!value);
    }
  });

  it("withRenderMode", () => {
    const vf = ViewFlags.fromRenderMode(RenderMode.SolidFill);
    const sf = vf.withRenderMode(RenderMode.SolidFill);

    expect(vf.getClosestRenderMode()).to.equal(RenderMode.SolidFill);
    expect(sf.getClosestRenderMode()).to.equal(RenderMode.SolidFill);

    for (const key of Object.keys(vf))
      expect((sf as any)[key]).to.equal((vf as any)[key]);

    expect(sf.equals(vf)).to.be.true;
    expect(sf.toJSON()).to.deep.equal(vf.toJSON());

    expect(vf.withRenderMode(RenderMode.HiddenLine).toJSON().renderMode).to.equal(RenderMode.HiddenLine);
  });

  it("compares for equality", () => {
    const def = ViewFlags.defaults;
    for (const propName of Object.keys(def)) {
      const key = propName as keyof Omit<ViewFlagsProperties, "renderMode">;
      const value = def[key];
      if (typeof value !== "boolean") {
        expect(key).to.equal("renderMode");
        expect(def.getClosestRenderMode()).to.equal(RenderMode.Wireframe);
        expect(def.equals(def.withRenderMode(RenderMode.SmoothShade))).to.be.false;
      } else {
        expect(def.equals(def.with(key, !value))).to.be.false;
      }
    }
  });
});
