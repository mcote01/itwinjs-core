/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module WebGL
 */

import { assert } from "@itwin/core-bentley";
import { TextureUnit } from "../RenderFlags";
import { FragmentShaderComponent, ProgramBuilder, VariablePrecision, VariableType } from "../ShaderBuilder";
import { System } from "../System";
import { addEyeSpace } from "./Common";
import { addModelViewMatrix } from "./Vertex";

const getClipPlaneFloat = `
vec4 getClipPlane(int index) {
  float x = 0.5;
  float y = (float(index) + 0.5) / float(u_clipParams[2]);
  return TEXTURE(s_clipSampler, vec2(x, y));
}
`;

export const unpackFloat = `
float unpackFloat(vec4 v) {
  const float bias = 38.0;
  v = floor(v * 255.0 + 0.5);
  float temp = v.w / 2.0;
  float exponent = floor(temp);
  float sign = (temp - exponent) * 2.0;
  exponent = exponent - bias;
  sign = -(sign * 2.0 - 1.0);
  float unpacked = dot(sign * v.xyz, vec3(1.0 / 256.0, 1.0 / 65536.0, 1.0 / 16777216.0)); // shift x right 8, y right 16 and z right 24
  return unpacked * pow(10.0, exponent);
}
`;

// ###TODO: oct-encode the normal to reduce # of samples from 4 to 2
const unpackClipPlane = `
vec4 getClipPlane(int index) {
  float y = (float(index) + 0.5) / float(u_clipParams[2]);
  float sx = 0.25;
  vec2 tc = vec2(0.125, y);
  float nx = unpackFloat(TEXTURE(s_clipSampler, tc));
  tc.x += sx;
  float ny = unpackFloat(TEXTURE(s_clipSampler, tc));
  tc.x += sx;
  float nz = unpackFloat(TEXTURE(s_clipSampler, tc));
  tc.x += sx;
  float dist = unpackFloat(TEXTURE(s_clipSampler, tc));
  return vec4(nx, ny, nz, dist);
}
`;

const calcClipPlaneDist = `
float calcClipPlaneDist(vec3 camPos, vec4 plane) {
  return dot(vec4(camPos, 1.0), plane);
}
`;

const applyClipPlanesPrelude = `
  int numPlaneSets = 1;
  int numSetsClippedBy = 0;
  bool clippedByCurrentPlaneSet = false;
`;

const applyClipPlanesLoopWebGL1 = `
  for (int i = 0; i < MAX_CLIPPING_PLANES; i++) {
    if (i < u_clipParams[0])
      continue;
    else if (i >= u_clipParams[1])
      break;
`;

const applyClipPlanesLoopWebGL2 = `
  for (int i = u_clipParams[0]; i < u_clipParams[1]; i++) {
`;

const applyClipPlanesPostlude = `
    vec4 plane = getClipPlane(i);
    if (plane.x == 2.0) { // indicates start of new UnionOfConvexClipPlaneSets
      if (numSetsClippedBy + int(clippedByCurrentPlaneSet) == numPlaneSets)
        break;

      numPlaneSets = 1;
      numSetsClippedBy = 0;
      clippedByCurrentPlaneSet = false;
    } else if (plane.xyz == vec3(0.0)) { // indicates start of new clip plane set
      numPlaneSets = numPlaneSets + 1;
      numSetsClippedBy += int(clippedByCurrentPlaneSet);
      clippedByCurrentPlaneSet = false;
    } else if (!clippedByCurrentPlaneSet && calcClipPlaneDist(v_eyeSpace, plane) < 0.0) {
      clippedByCurrentPlaneSet = true;
    }
  }

  numSetsClippedBy += int(clippedByCurrentPlaneSet);
  if (numSetsClippedBy == numPlaneSets) {
    if (u_outsideRgba.a > 0.0) {
      g_clipColor = u_outsideRgba.rgb;
      return true;
    } else {
      discard;
    }
  } else if (u_insideRgba.a > 0.0) {
    g_clipColor = u_insideRgba.rgb;
    return true;
  }

  return false;
`;

const applyClipPlanesWebGL1 = applyClipPlanesPrelude + applyClipPlanesLoopWebGL1 + applyClipPlanesPostlude;
const applyClipPlanesWebGL2 = applyClipPlanesPrelude + applyClipPlanesLoopWebGL2 + applyClipPlanesPostlude;

const clipParams = new Int32Array(3);

/** @internal */
export function addClipping(prog: ProgramBuilder, isWebGL2: boolean) {
  const frag = prog.frag;
  const vert = prog.vert;

  addEyeSpace(prog);

  // [0] = index of first plane
  // [1] = index of last plane (one past the end)
  // [2] = texture height
  prog.addUniformArray("u_clipParams", VariableType.Int, 3, (program) => {
    program.addGraphicUniform("u_clipParams", (uniform, params) => {
      // Set this to false to visualize pre-shader culling of geometry.
      const doClipping = true;

      const stack = params.target.uniforms.branch.clipStack;
      clipParams[0] = stack.startIndex;
      clipParams[1] = stack.endIndex;
      clipParams[2] = doClipping ? stack.textureHeight : 0;
      assert(clipParams[2] > 0 || !doClipping);
      uniform.setUniform1iv(clipParams);
    });
  });

  prog.addUniform("u_outsideRgba", VariableType.Vec4, (program) => {
    program.addGraphicUniform("u_outsideRgba", (uniform, params) => {
      params.target.uniforms.branch.clipStack.outsideColor.bind(uniform);
    });
  });

  prog.addUniform("u_insideRgba", VariableType.Vec4, (program) => {
    program.addGraphicUniform("u_insideRgba", (uniform, params) => {
      params.target.uniforms.branch.clipStack.insideColor.bind(uniform);
    });
  });

  addModelViewMatrix(vert);

  if (System.instance.capabilities.supportsTextureFloat) {
    frag.addFunction(getClipPlaneFloat);
  } else {
    frag.addFunction(unpackFloat);
    frag.addFunction(unpackClipPlane);
  }

  frag.addFunction(calcClipPlaneDist);
  frag.addUniform("s_clipSampler", VariableType.Sampler2D, (program) => {
    program.addGraphicUniform("s_clipSampler", (uniform, params) => {
      const texture = params.target.uniforms.branch.clipStack.texture;
      assert(texture !== undefined);
      if (texture !== undefined)
        texture.bindSampler(uniform, TextureUnit.ClipVolume);
    });
  }, VariablePrecision.High);

  frag.set(FragmentShaderComponent.ApplyClipping, isWebGL2 ? applyClipPlanesWebGL2 : applyClipPlanesWebGL1);
}
