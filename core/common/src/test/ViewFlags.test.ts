/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { assert, expect } from "chai";
import {
  RenderMode, ViewFlagOverrides, ViewFlagProps, ViewFlags, ViewFlagsProperties,
} from "../ViewFlags";

function invertDefaults(): ViewFlags {
  return invertViewFlags(ViewFlags.create());
}

function invertViewFlags(vf: ViewFlags): ViewFlags {
  const invertedProperties: Partial<Omit<ViewFlagsProperties, "renderMode">> = { };
  for (const propname of Object.keys(vf)) {
    const key = propname as keyof Partial<Omit<ViewFlagsProperties, "renderMode">>;
    const value = vf[key];
    invertedProperties[key] = !value;
  }

  return ViewFlags.create(invertedProperties);
}

describe("ViewFlags", () => {
  it("should initialize to expected defaults", () => {
    let flags = ViewFlags.create();
    assert(flags.acsTriad === false);
    assert(flags.grid === false);
    assert(flags.fill === true);
    assert(flags.getClosestRenderMode() === RenderMode.SmoothShade);

    flags = ViewFlags.fromJSON();
    expect(flags.getClosestRenderMode()).to.equal(RenderMode.Wireframe);
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
      noEdgeOverrides: true,
      noMaterial: true,
      noTexture: true,
    };

    roundTrip(undefined, defaults);
    roundTrip(ViewFlags.create().toJSON(), ViewFlags.fromRenderMode(RenderMode.SmoothShade).toJSON());

    roundTrip(invertViewFlags(ViewFlags.fromJSON(defaults)).toJSON(), {
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
    const def = ViewFlags.fromRenderMode(RenderMode.Wireframe);
    expect(def.copy({})).to.deep.equal(def);

    const inv = invertDefaults();
    expect(def.copy(inv)).to.deep.equal(inv);
    expect(inv.copy(def)).to.deep.equal(def);

    expect(inv.copy({ ...inv, transparency: undefined })).to.deep.equal({ ...inv, transparency: true });
  });

  it("overrides", () => {
    const def = ViewFlags.fromRenderMode(RenderMode.Wireframe);
    expect(def.override({})).to.deep.equal(def);

    const inv = invertDefaults();
    expect(def.override(inv)).to.deep.equal(inv);
    expect(inv.override(def)).to.deep.equal(def);

    expect(inv.override({ ...inv, transparency: undefined })).to.deep.equal(inv);
  });

  it("returns defaults if no properties supplied", () => {
    expect(ViewFlags.fromJSON()).to.equal(ViewFlags.fromRenderMode(RenderMode.Wireframe));
    expect(ViewFlags.create()).to.equal(ViewFlags.fromRenderMode(RenderMode.SmoothShade));
    expect(ViewFlags.create({ })).to.equal(ViewFlags.fromRenderMode(RenderMode.SmoothShade));
  });

  it("uses different defaults for undefined vs ViewFlagProps", () => {
    const def = ViewFlags.fromRenderMode(RenderMode.Wireframe);
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

    expectLighting(ViewFlags.create(), true);
    expectLighting(ViewFlags.create({ lighting: false }), false);
    expectLighting(ViewFlags.create({ lighting: true }), true);

    for (const renderMode of [RenderMode.Wireframe, RenderMode.SmoothShade, RenderMode.SolidFill, RenderMode.HiddenLine]) {
      const lit = RenderMode.SmoothShade === renderMode;
      expectLighting(ViewFlags.fromJSON({ renderMode }), lit);
      expectLighting(ViewFlags.fromRenderMode(renderMode), lit);
    }
  });

  it("constructs from self", () => {
    const vf = ViewFlags.fromRenderMode(RenderMode.Wireframe);
    expect(vf.equals(ViewFlags.create(vf))).to.be.true;
    expect(ViewFlags.fromJSON(vf.toJSON()).toJSON()).to.deep.equal(vf.toJSON());
    expect(ViewFlags.fromJSON(vf.toJSON()).equals(vf)).to.be.true;
  });

  it("with", () => {
    const def = ViewFlags.fromJSON();
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
    const def = ViewFlags.fromJSON();
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
