/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { ByteStream } from "@itwin/core-bentley";
import { Range3d } from "@itwin/core-geometry";
import { GltfDataType, RenderTexture } from "@itwin/core-common";
import { B3dmReader, IModelApp, MockRender, SnapshotConnection } from "@itwin/core-frontend";
import { TestUtility } from "../../TestUtility";

/* eslint-disable @typescript-eslint/unbound-method */

const b3dmBytes = new Uint8Array([
  0x62, 0x33, 0x64, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x90, 0x10, 0x00, 0x00, 0x14, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x24, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7b, 0x22, 0x42, 0x41,
  0x54, 0x43, 0x48, 0x5f, 0x4c, 0x45, 0x4e, 0x47, 0x54, 0x48, 0x22, 0x3a, 0x31, 0x7d, 0x20, 0x20,
  0x7b, 0x22, 0x62, 0x61, 0x74, 0x63, 0x68, 0x49, 0x64, 0x22, 0x3a, 0x5b, 0x30, 0x5d, 0x2c, 0x22,
  0x6e, 0x61, 0x6d, 0x65, 0x22, 0x3a, 0x5b, 0x22, 0x6d, 0x65, 0x73, 0x68, 0x5f, 0x30, 0x22, 0x5d,
  0x7d, 0x20, 0x20, 0x20, 0x67, 0x6c, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00, 0x3c, 0x10, 0x00, 0x00,
  0xe8, 0x08, 0x00, 0x00, 0x4a, 0x53, 0x4f, 0x4e, 0x7b, 0x22, 0x61, 0x63, 0x63, 0x65, 0x73, 0x73,
  0x6f, 0x72, 0x73, 0x22, 0x3a, 0x5b, 0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x56, 0x69,
  0x65, 0x77, 0x22, 0x3a, 0x30, 0x2c, 0x22, 0x63, 0x6f, 0x6d, 0x70, 0x6f, 0x6e, 0x65, 0x6e, 0x74,
  0x54, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x35, 0x31, 0x32, 0x35, 0x2c, 0x22, 0x63, 0x6f, 0x75, 0x6e,
  0x74, 0x22, 0x3a, 0x33, 0x30, 0x2c, 0x22, 0x6d, 0x61, 0x78, 0x22, 0x3a, 0x5b, 0x31, 0x31, 0x2e,
  0x30, 0x5d, 0x2c, 0x22, 0x6d, 0x69, 0x6e, 0x22, 0x3a, 0x5b, 0x30, 0x2e, 0x30, 0x5d, 0x2c, 0x22,
  0x74, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x22, 0x53, 0x43, 0x41, 0x4c, 0x41, 0x52, 0x22, 0x7d, 0x2c,
  0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x56, 0x69, 0x65, 0x77, 0x22, 0x3a, 0x31, 0x2c,
  0x22, 0x63, 0x6f, 0x6d, 0x70, 0x6f, 0x6e, 0x65, 0x6e, 0x74, 0x54, 0x79, 0x70, 0x65, 0x22, 0x3a,
  0x35, 0x31, 0x32, 0x36, 0x2c, 0x22, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x22, 0x3a, 0x31, 0x32, 0x2c,
  0x22, 0x6d, 0x61, 0x78, 0x22, 0x3a, 0x5b, 0x33, 0x32, 0x39, 0x2e, 0x36, 0x38, 0x36, 0x33, 0x30,
  0x39, 0x38, 0x31, 0x34, 0x34, 0x35, 0x33, 0x2c, 0x2d, 0x31, 0x35, 0x39, 0x2e, 0x36, 0x31, 0x37,
  0x32, 0x36, 0x33, 0x37, 0x39, 0x33, 0x39, 0x34, 0x35, 0x2c, 0x31, 0x34, 0x2e, 0x35, 0x36, 0x38,
  0x36, 0x35, 0x31, 0x31, 0x39, 0x39, 0x33, 0x34, 0x30, 0x38, 0x5d, 0x2c, 0x22, 0x6d, 0x69, 0x6e,
  0x22, 0x3a, 0x5b, 0x33, 0x31, 0x39, 0x2e, 0x38, 0x32, 0x39, 0x38, 0x30, 0x33, 0x34, 0x36, 0x36,
  0x37, 0x39, 0x37, 0x2c, 0x2d, 0x31, 0x37, 0x35, 0x2e, 0x38, 0x37, 0x35, 0x30, 0x34, 0x35, 0x37,
  0x37, 0x36, 0x33, 0x36, 0x37, 0x2c, 0x31, 0x31, 0x2e, 0x35, 0x35, 0x39, 0x31, 0x31, 0x30, 0x36,
  0x34, 0x31, 0x34, 0x37, 0x39, 0x35, 0x5d, 0x2c, 0x22, 0x74, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x22,
  0x56, 0x45, 0x43, 0x33, 0x22, 0x7d, 0x2c, 0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x56,
  0x69, 0x65, 0x77, 0x22, 0x3a, 0x32, 0x2c, 0x22, 0x63, 0x6f, 0x6d, 0x70, 0x6f, 0x6e, 0x65, 0x6e,
  0x74, 0x54, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x35, 0x31, 0x32, 0x36, 0x2c, 0x22, 0x63, 0x6f, 0x75,
  0x6e, 0x74, 0x22, 0x3a, 0x31, 0x32, 0x2c, 0x22, 0x6d, 0x61, 0x78, 0x22, 0x3a, 0x5b, 0x35, 0x2e,
  0x30, 0x37, 0x35, 0x39, 0x36, 0x38, 0x31, 0x34, 0x37, 0x31, 0x33, 0x39, 0x30, 0x36, 0x65, 0x2d,
  0x30, 0x35, 0x2c, 0x30, 0x2e, 0x34, 0x32, 0x33, 0x34, 0x39, 0x32, 0x35, 0x35, 0x30, 0x38, 0x34,
  0x39, 0x39, 0x31, 0x35, 0x2c, 0x31, 0x2e, 0x30, 0x5d, 0x2c, 0x22, 0x6d, 0x69, 0x6e, 0x22, 0x3a,
  0x5b, 0x2d, 0x30, 0x2e, 0x39, 0x36, 0x36, 0x30, 0x34, 0x37, 0x33, 0x34, 0x36, 0x35, 0x39, 0x31,
  0x39, 0x34, 0x39, 0x2c, 0x2d, 0x30, 0x2e, 0x38, 0x34, 0x31, 0x39, 0x34, 0x39, 0x33, 0x34, 0x33,
  0x36, 0x38, 0x31, 0x33, 0x33, 0x35, 0x2c, 0x30, 0x2e, 0x30, 0x39, 0x39, 0x30, 0x32, 0x37, 0x36,
  0x33, 0x33, 0x36, 0x36, 0x36, 0x39, 0x39, 0x32, 0x32, 0x5d, 0x2c, 0x22, 0x74, 0x79, 0x70, 0x65,
  0x22, 0x3a, 0x22, 0x56, 0x45, 0x43, 0x33, 0x22, 0x7d, 0x2c, 0x7b, 0x22, 0x62, 0x75, 0x66, 0x66,
  0x65, 0x72, 0x56, 0x69, 0x65, 0x77, 0x22, 0x3a, 0x33, 0x2c, 0x22, 0x63, 0x6f, 0x6d, 0x70, 0x6f,
  0x6e, 0x65, 0x6e, 0x74, 0x54, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x35, 0x31, 0x32, 0x36, 0x2c, 0x22,
  0x63, 0x6f, 0x75, 0x6e, 0x74, 0x22, 0x3a, 0x31, 0x32, 0x2c, 0x22, 0x6d, 0x61, 0x78, 0x22, 0x3a,
  0x5b, 0x30, 0x2e, 0x37, 0x33, 0x35, 0x35, 0x34, 0x36, 0x39, 0x34, 0x36, 0x35, 0x32, 0x35, 0x35,
  0x37, 0x34, 0x2c, 0x30, 0x2e, 0x37, 0x32, 0x34, 0x30, 0x32, 0x38, 0x38, 0x32, 0x35, 0x37, 0x35,
  0x39, 0x38, 0x38, 0x38, 0x5d, 0x2c, 0x22, 0x6d, 0x69, 0x6e, 0x22, 0x3a, 0x5b, 0x30, 0x2e, 0x31,
  0x33, 0x37, 0x38, 0x30, 0x38, 0x35, 0x30, 0x31, 0x37, 0x32, 0x30, 0x34, 0x32, 0x38, 0x2c, 0x30,
  0x2e, 0x35, 0x30, 0x34, 0x39, 0x32, 0x34, 0x32, 0x39, 0x37, 0x33, 0x33, 0x32, 0x37, 0x36, 0x34,
  0x5d, 0x2c, 0x22, 0x74, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x22, 0x56, 0x45, 0x43, 0x32, 0x22, 0x7d,
  0x5d, 0x2c, 0x22, 0x61, 0x73, 0x73, 0x65, 0x74, 0x22, 0x3a, 0x7b, 0x22, 0x67, 0x65, 0x6e, 0x65,
  0x72, 0x61, 0x74, 0x6f, 0x72, 0x22, 0x3a, 0x22, 0x66, 0x61, 0x6e, 0x66, 0x61, 0x6e, 0x22, 0x2c,
  0x22, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x22, 0x3a, 0x22, 0x32, 0x2e, 0x30, 0x22, 0x7d,
  0x2c, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x56, 0x69, 0x65, 0x77, 0x73, 0x22, 0x3a, 0x5b,
  0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x22, 0x3a, 0x30, 0x2c, 0x22, 0x62, 0x79, 0x74,
  0x65, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x22, 0x3a, 0x31, 0x32, 0x30, 0x2c, 0x22, 0x62, 0x79,
  0x74, 0x65, 0x4f, 0x66, 0x66, 0x73, 0x65, 0x74, 0x22, 0x3a, 0x30, 0x2c, 0x22, 0x74, 0x61, 0x72,
  0x67, 0x65, 0x74, 0x22, 0x3a, 0x33, 0x34, 0x39, 0x36, 0x33, 0x7d, 0x2c, 0x7b, 0x22, 0x62, 0x75,
  0x66, 0x66, 0x65, 0x72, 0x22, 0x3a, 0x30, 0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4c, 0x65, 0x6e,
  0x67, 0x74, 0x68, 0x22, 0x3a, 0x31, 0x34, 0x34, 0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4f, 0x66,
  0x66, 0x73, 0x65, 0x74, 0x22, 0x3a, 0x31, 0x32, 0x30, 0x2c, 0x22, 0x74, 0x61, 0x72, 0x67, 0x65,
  0x74, 0x22, 0x3a, 0x33, 0x34, 0x39, 0x36, 0x32, 0x7d, 0x2c, 0x7b, 0x22, 0x62, 0x75, 0x66, 0x66,
  0x65, 0x72, 0x22, 0x3a, 0x30, 0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4c, 0x65, 0x6e, 0x67, 0x74,
  0x68, 0x22, 0x3a, 0x31, 0x34, 0x34, 0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4f, 0x66, 0x66, 0x73,
  0x65, 0x74, 0x22, 0x3a, 0x32, 0x36, 0x34, 0x2c, 0x22, 0x74, 0x61, 0x72, 0x67, 0x65, 0x74, 0x22,
  0x3a, 0x33, 0x34, 0x39, 0x36, 0x32, 0x7d, 0x2c, 0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72,
  0x22, 0x3a, 0x30, 0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x22,
  0x3a, 0x39, 0x36, 0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4f, 0x66, 0x66, 0x73, 0x65, 0x74, 0x22,
  0x3a, 0x34, 0x30, 0x38, 0x2c, 0x22, 0x74, 0x61, 0x72, 0x67, 0x65, 0x74, 0x22, 0x3a, 0x33, 0x34,
  0x39, 0x36, 0x32, 0x7d, 0x2c, 0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x22, 0x3a, 0x30,
  0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x22, 0x3a, 0x38, 0x35,
  0x35, 0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4f, 0x66, 0x66, 0x73, 0x65, 0x74, 0x22, 0x3a, 0x35,
  0x30, 0x34, 0x7d, 0x2c, 0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x22, 0x3a, 0x30, 0x2c,
  0x22, 0x62, 0x79, 0x74, 0x65, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x22, 0x3a, 0x33, 0x33, 0x33,
  0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4f, 0x66, 0x66, 0x73, 0x65, 0x74, 0x22, 0x3a, 0x31, 0x33,
  0x36, 0x30, 0x2c, 0x22, 0x74, 0x61, 0x72, 0x67, 0x65, 0x74, 0x22, 0x3a, 0x33, 0x34, 0x39, 0x36,
  0x32, 0x7d, 0x2c, 0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x22, 0x3a, 0x30, 0x2c, 0x22,
  0x62, 0x79, 0x74, 0x65, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x22, 0x3a, 0x31, 0x35, 0x31, 0x2c,
  0x22, 0x62, 0x79, 0x74, 0x65, 0x4f, 0x66, 0x66, 0x73, 0x65, 0x74, 0x22, 0x3a, 0x31, 0x36, 0x39,
  0x36, 0x2c, 0x22, 0x74, 0x61, 0x72, 0x67, 0x65, 0x74, 0x22, 0x3a, 0x33, 0x34, 0x39, 0x36, 0x32,
  0x7d, 0x5d, 0x2c, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x73, 0x22, 0x3a, 0x5b, 0x7b, 0x22,
  0x62, 0x79, 0x74, 0x65, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x22, 0x3a, 0x31, 0x38, 0x34, 0x38,
  0x7d, 0x5d, 0x2c, 0x22, 0x65, 0x78, 0x74, 0x65, 0x6e, 0x73, 0x69, 0x6f, 0x6e, 0x73, 0x22, 0x3a,
  0x7b, 0x22, 0x4b, 0x48, 0x52, 0x5f, 0x74, 0x65, 0x63, 0x68, 0x6e, 0x69, 0x71, 0x75, 0x65, 0x73,
  0x5f, 0x77, 0x65, 0x62, 0x67, 0x6c, 0x22, 0x3a, 0x7b, 0x22, 0x70, 0x72, 0x6f, 0x67, 0x72, 0x61,
  0x6d, 0x73, 0x22, 0x3a, 0x5b, 0x7b, 0x22, 0x61, 0x74, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65,
  0x73, 0x22, 0x3a, 0x5b, 0x22, 0x61, 0x5f, 0x70, 0x6f, 0x73, 0x69, 0x74, 0x69, 0x6f, 0x6e, 0x22,
  0x2c, 0x22, 0x61, 0x5f, 0x74, 0x65, 0x78, 0x63, 0x6f, 0x6f, 0x72, 0x64, 0x30, 0x22, 0x5d, 0x2c,
  0x22, 0x66, 0x72, 0x61, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x53, 0x68, 0x61, 0x64, 0x65, 0x72, 0x22,
  0x3a, 0x31, 0x2c, 0x22, 0x76, 0x65, 0x72, 0x74, 0x65, 0x78, 0x53, 0x68, 0x61, 0x64, 0x65, 0x72,
  0x22, 0x3a, 0x30, 0x7d, 0x5d, 0x2c, 0x22, 0x73, 0x68, 0x61, 0x64, 0x65, 0x72, 0x73, 0x22, 0x3a,
  0x5b, 0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x56, 0x69, 0x65, 0x77, 0x22, 0x3a, 0x35,
  0x2c, 0x22, 0x74, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x33, 0x35, 0x36, 0x33, 0x33, 0x7d, 0x2c, 0x7b,
  0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x56, 0x69, 0x65, 0x77, 0x22, 0x3a, 0x36, 0x2c, 0x22,
  0x74, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x33, 0x35, 0x36, 0x33, 0x32, 0x7d, 0x5d, 0x2c, 0x22, 0x74,
  0x65, 0x63, 0x68, 0x6e, 0x69, 0x71, 0x75, 0x65, 0x73, 0x22, 0x3a, 0x5b, 0x7b, 0x22, 0x61, 0x74,
  0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x61, 0x5f, 0x62, 0x61,
  0x74, 0x63, 0x68, 0x69, 0x64, 0x22, 0x3a, 0x7b, 0x22, 0x73, 0x65, 0x6d, 0x61, 0x6e, 0x74, 0x69,
  0x63, 0x22, 0x3a, 0x22, 0x5f, 0x42, 0x41, 0x54, 0x43, 0x48, 0x49, 0x44, 0x22, 0x2c, 0x22, 0x74,
  0x79, 0x70, 0x65, 0x22, 0x3a, 0x35, 0x31, 0x32, 0x33, 0x7d, 0x2c, 0x22, 0x61, 0x5f, 0x70, 0x6f,
  0x73, 0x69, 0x74, 0x69, 0x6f, 0x6e, 0x22, 0x3a, 0x7b, 0x22, 0x73, 0x65, 0x6d, 0x61, 0x6e, 0x74,
  0x69, 0x63, 0x22, 0x3a, 0x22, 0x50, 0x4f, 0x53, 0x49, 0x54, 0x49, 0x4f, 0x4e, 0x22, 0x2c, 0x22,
  0x74, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x33, 0x35, 0x36, 0x36, 0x35, 0x7d, 0x2c, 0x22, 0x61, 0x5f,
  0x74, 0x65, 0x78, 0x63, 0x6f, 0x6f, 0x72, 0x64, 0x30, 0x22, 0x3a, 0x7b, 0x22, 0x73, 0x65, 0x6d,
  0x61, 0x6e, 0x74, 0x69, 0x63, 0x22, 0x3a, 0x22, 0x54, 0x45, 0x58, 0x43, 0x4f, 0x4f, 0x52, 0x44,
  0x5f, 0x30, 0x22, 0x2c, 0x22, 0x74, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x33, 0x35, 0x36, 0x36, 0x34,
  0x7d, 0x7d, 0x2c, 0x22, 0x70, 0x72, 0x6f, 0x67, 0x72, 0x61, 0x6d, 0x22, 0x3a, 0x30, 0x2c, 0x22,
  0x73, 0x74, 0x61, 0x74, 0x65, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x65, 0x6e, 0x61, 0x62, 0x6c, 0x65,
  0x22, 0x3a, 0x5b, 0x32, 0x38, 0x38, 0x34, 0x2c, 0x32, 0x39, 0x32, 0x39, 0x5d, 0x7d, 0x2c, 0x22,
  0x75, 0x6e, 0x69, 0x66, 0x6f, 0x72, 0x6d, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x75, 0x5f, 0x64, 0x69,
  0x66, 0x66, 0x75, 0x73, 0x65, 0x22, 0x3a, 0x7b, 0x22, 0x74, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x33,
  0x35, 0x36, 0x37, 0x38, 0x7d, 0x2c, 0x22, 0x75, 0x5f, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x56, 0x69,
  0x65, 0x77, 0x4d, 0x61, 0x74, 0x72, 0x69, 0x78, 0x22, 0x3a, 0x7b, 0x22, 0x73, 0x65, 0x6d, 0x61,
  0x6e, 0x74, 0x69, 0x63, 0x22, 0x3a, 0x22, 0x4d, 0x4f, 0x44, 0x45, 0x4c, 0x56, 0x49, 0x45, 0x57,
  0x22, 0x2c, 0x22, 0x74, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x33, 0x35, 0x36, 0x37, 0x36, 0x7d, 0x2c,
  0x22, 0x75, 0x5f, 0x70, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x4d, 0x61, 0x74,
  0x72, 0x69, 0x78, 0x22, 0x3a, 0x7b, 0x22, 0x73, 0x65, 0x6d, 0x61, 0x6e, 0x74, 0x69, 0x63, 0x22,
  0x3a, 0x22, 0x50, 0x52, 0x4f, 0x4a, 0x45, 0x43, 0x54, 0x49, 0x4f, 0x4e, 0x22, 0x2c, 0x22, 0x74,
  0x79, 0x70, 0x65, 0x22, 0x3a, 0x33, 0x35, 0x36, 0x37, 0x36, 0x7d, 0x7d, 0x7d, 0x5d, 0x7d, 0x7d,
  0x2c, 0x22, 0x65, 0x78, 0x74, 0x65, 0x6e, 0x73, 0x69, 0x6f, 0x6e, 0x73, 0x52, 0x65, 0x71, 0x75,
  0x69, 0x72, 0x65, 0x64, 0x22, 0x3a, 0x5b, 0x22, 0x4b, 0x48, 0x52, 0x5f, 0x74, 0x65, 0x63, 0x68,
  0x6e, 0x69, 0x71, 0x75, 0x65, 0x73, 0x5f, 0x77, 0x65, 0x62, 0x67, 0x6c, 0x22, 0x5d, 0x2c, 0x22,
  0x65, 0x78, 0x74, 0x65, 0x6e, 0x73, 0x69, 0x6f, 0x6e, 0x73, 0x55, 0x73, 0x65, 0x64, 0x22, 0x3a,
  0x5b, 0x22, 0x4b, 0x48, 0x52, 0x5f, 0x74, 0x65, 0x63, 0x68, 0x6e, 0x69, 0x71, 0x75, 0x65, 0x73,
  0x5f, 0x77, 0x65, 0x62, 0x67, 0x6c, 0x22, 0x5d, 0x2c, 0x22, 0x69, 0x6d, 0x61, 0x67, 0x65, 0x73,
  0x22, 0x3a, 0x5b, 0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x56, 0x69, 0x65, 0x77, 0x22,
  0x3a, 0x34, 0x2c, 0x22, 0x6d, 0x69, 0x6d, 0x65, 0x54, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x22, 0x69,
  0x6d, 0x61, 0x67, 0x65, 0x2f, 0x6a, 0x70, 0x65, 0x67, 0x22, 0x7d, 0x5d, 0x2c, 0x22, 0x6d, 0x61,
  0x74, 0x65, 0x72, 0x69, 0x61, 0x6c, 0x73, 0x22, 0x3a, 0x5b, 0x7b, 0x22, 0x65, 0x78, 0x74, 0x65,
  0x6e, 0x73, 0x69, 0x6f, 0x6e, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x4b, 0x48, 0x52, 0x5f, 0x74, 0x65,
  0x63, 0x68, 0x6e, 0x69, 0x71, 0x75, 0x65, 0x73, 0x5f, 0x77, 0x65, 0x62, 0x67, 0x6c, 0x22, 0x3a,
  0x7b, 0x22, 0x74, 0x65, 0x63, 0x68, 0x6e, 0x69, 0x71, 0x75, 0x65, 0x22, 0x3a, 0x30, 0x2c, 0x22,
  0x76, 0x61, 0x6c, 0x75, 0x65, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x75, 0x5f, 0x64, 0x69, 0x66, 0x66,
  0x75, 0x73, 0x65, 0x22, 0x3a, 0x7b, 0x22, 0x69, 0x6e, 0x64, 0x65, 0x78, 0x22, 0x3a, 0x30, 0x2c,
  0x22, 0x74, 0x65, 0x78, 0x43, 0x6f, 0x6f, 0x72, 0x64, 0x22, 0x3a, 0x30, 0x7d, 0x7d, 0x7d, 0x7d,
  0x7d, 0x5d, 0x2c, 0x22, 0x6d, 0x65, 0x73, 0x68, 0x65, 0x73, 0x22, 0x3a, 0x5b, 0x7b, 0x22, 0x70,
  0x72, 0x69, 0x6d, 0x69, 0x74, 0x69, 0x76, 0x65, 0x73, 0x22, 0x3a, 0x5b, 0x7b, 0x22, 0x61, 0x74,
  0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x4e, 0x4f, 0x52, 0x4d,
  0x41, 0x4c, 0x22, 0x3a, 0x32, 0x2c, 0x22, 0x50, 0x4f, 0x53, 0x49, 0x54, 0x49, 0x4f, 0x4e, 0x22,
  0x3a, 0x31, 0x2c, 0x22, 0x54, 0x45, 0x58, 0x43, 0x4f, 0x4f, 0x52, 0x44, 0x5f, 0x30, 0x22, 0x3a,
  0x33, 0x7d, 0x2c, 0x22, 0x69, 0x6e, 0x64, 0x69, 0x63, 0x65, 0x73, 0x22, 0x3a, 0x30, 0x2c, 0x22,
  0x6d, 0x61, 0x74, 0x65, 0x72, 0x69, 0x61, 0x6c, 0x22, 0x3a, 0x30, 0x2c, 0x22, 0x6d, 0x6f, 0x64,
  0x65, 0x22, 0x3a, 0x34, 0x7d, 0x5d, 0x7d, 0x5d, 0x2c, 0x22, 0x6e, 0x6f, 0x64, 0x65, 0x73, 0x22,
  0x3a, 0x5b, 0x7b, 0x22, 0x6d, 0x65, 0x73, 0x68, 0x22, 0x3a, 0x30, 0x2c, 0x22, 0x6e, 0x61, 0x6d,
  0x65, 0x22, 0x3a, 0x22, 0x22, 0x7d, 0x5d, 0x2c, 0x22, 0x73, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x72,
  0x73, 0x22, 0x3a, 0x5b, 0x7b, 0x22, 0x6d, 0x61, 0x67, 0x46, 0x69, 0x6c, 0x74, 0x65, 0x72, 0x22,
  0x3a, 0x39, 0x37, 0x32, 0x39, 0x2c, 0x22, 0x6d, 0x69, 0x6e, 0x46, 0x69, 0x6c, 0x74, 0x65, 0x72,
  0x22, 0x3a, 0x39, 0x39, 0x38, 0x36, 0x2c, 0x22, 0x77, 0x72, 0x61, 0x70, 0x53, 0x22, 0x3a, 0x31,
  0x30, 0x34, 0x39, 0x37, 0x2c, 0x22, 0x77, 0x72, 0x61, 0x70, 0x54, 0x22, 0x3a, 0x31, 0x30, 0x34,
  0x39, 0x37, 0x7d, 0x5d, 0x2c, 0x22, 0x73, 0x63, 0x65, 0x6e, 0x65, 0x22, 0x3a, 0x30, 0x2c, 0x22,
  0x73, 0x63, 0x65, 0x6e, 0x65, 0x73, 0x22, 0x3a, 0x5b, 0x7b, 0x22, 0x6e, 0x6f, 0x64, 0x65, 0x73,
  0x22, 0x3a, 0x5b, 0x30, 0x5d, 0x7d, 0x5d, 0x2c, 0x22, 0x74, 0x65, 0x78, 0x74, 0x75, 0x72, 0x65,
  0x73, 0x22, 0x3a, 0x5b, 0x7b, 0x22, 0x73, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x72, 0x22, 0x3a, 0x30,
  0x2c, 0x22, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x22, 0x3a, 0x30, 0x7d, 0x5d, 0x7d, 0x20, 0x20,
  0x38, 0x07, 0x00, 0x00, 0x42, 0x49, 0x4e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
  0x02, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x04, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00,
  0x05, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00,
  0x05, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00,
  0x09, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00,
  0x07, 0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00,
  0x09, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00,
  0x39, 0x63, 0xa2, 0x43, 0x44, 0xd3, 0x2d, 0xc3, 0x1e, 0xf3, 0x38, 0x41, 0xa8, 0x38, 0xa4, 0x43,
  0x03, 0xe0, 0x2f, 0xc3, 0x1e, 0xf2, 0x38, 0x41, 0x51, 0x40, 0xa2, 0x43, 0xb1, 0xba, 0x2c, 0xc3,
  0x32, 0x19, 0x69, 0x41, 0xaa, 0xbb, 0xa2, 0x43, 0xe1, 0x94, 0x2a, 0xc3, 0x55, 0xf3, 0x38, 0x41,
  0x51, 0x40, 0xa2, 0x43, 0xb1, 0xba, 0x2c, 0xc3, 0x32, 0x19, 0x69, 0x41, 0xc6, 0xbc, 0xa3, 0x43,
  0x56, 0x27, 0x28, 0xc3, 0x2d, 0xf3, 0x38, 0x41, 0xaa, 0xbb, 0xa2, 0x43, 0xe1, 0x94, 0x2a, 0xc3,
  0x55, 0xf3, 0x38, 0x41, 0xd9, 0xd7, 0xa4, 0x43, 0x11, 0xdf, 0x25, 0xc3, 0xf5, 0xf2, 0x38, 0x41,
  0x37, 0xea, 0x9f, 0x43, 0x53, 0xef, 0x28, 0xc3, 0xae, 0xf4, 0x38, 0x41, 0x62, 0xc7, 0xa3, 0x43,
  0x73, 0xf2, 0x27, 0xc3, 0x2e, 0xf3, 0x38, 0x41, 0x00, 0xb9, 0xa3, 0x43, 0xdc, 0x13, 0x28, 0xc3,
  0x31, 0xf3, 0x38, 0x41, 0x88, 0x87, 0xa2, 0x43, 0x05, 0x9e, 0x1f, 0xc3, 0x96, 0xf4, 0x38, 0x41,
  0xa4, 0x0b, 0x5e, 0xbf, 0x83, 0xb6, 0xf9, 0xbe, 0x00, 0xcf, 0xca, 0x3d, 0x38, 0xed, 0xf0, 0xbe,
  0xfe, 0x89, 0x57, 0xbf, 0xad, 0x2a, 0x87, 0x3e, 0xe1, 0x4e, 0x77, 0xbf, 0x24, 0xf5, 0xf5, 0x3d,
  0x0a, 0x3f, 0x6a, 0x3e, 0x58, 0x66, 0x2a, 0xbf, 0x43, 0x37, 0xa2, 0x3e, 0x63, 0xfa, 0x2c, 0x3f,
  0xe1, 0x4e, 0x77, 0xbf, 0x24, 0xf5, 0xf5, 0x3d, 0x0a, 0x3f, 0x6a, 0x3e, 0x16, 0xff, 0xf1, 0xbe,
  0x04, 0xd4, 0xd8, 0x3e, 0xc8, 0xd7, 0x45, 0x3f, 0x58, 0x66, 0x2a, 0xbf, 0x43, 0x37, 0xa2, 0x3e,
  0x63, 0xfa, 0x2c, 0x3f, 0xc1, 0xc5, 0x95, 0xbd, 0xae, 0x2c, 0x91, 0x3d, 0x36, 0xab, 0x7e, 0x3f,
  0x12, 0xd0, 0x54, 0x38, 0xbf, 0x3c, 0xda, 0xb7, 0x00, 0x00, 0x80, 0x3f, 0x65, 0x57, 0x54, 0x38,
  0x18, 0xd8, 0xd5, 0xb7, 0x00, 0x00, 0x80, 0x3f, 0xd7, 0xdd, 0x53, 0x38, 0x27, 0xbb, 0xd0, 0xb7,
  0x00, 0x00, 0x80, 0x3f, 0xcb, 0xe6, 0x54, 0x38, 0xbe, 0x5a, 0xda, 0xb7, 0x00, 0x00, 0x80, 0x3f,
  0x3f, 0xd4, 0x2e, 0x3f, 0x59, 0x4e, 0x21, 0x3f, 0xce, 0x4c, 0x3c, 0x3f, 0xa7, 0x43, 0x24, 0x3f,
  0xb0, 0x61, 0x2a, 0x3f, 0xf4, 0x59, 0x39, 0x3f, 0x6a, 0x1c, 0x24, 0x3f, 0xff, 0x9b, 0x23, 0x3f,
  0x6c, 0xb5, 0xa3, 0x3e, 0xc6, 0xa0, 0x35, 0x3f, 0xcb, 0x3e, 0x70, 0x3e, 0x2b, 0xa6, 0x27, 0x3f,
  0x9d, 0xf8, 0x90, 0x3e, 0x86, 0x70, 0x24, 0x3f, 0x24, 0xf3, 0x3e, 0x3e, 0x4a, 0x5c, 0x2c, 0x3f,
  0xac, 0x07, 0x9c, 0x3e, 0x3a, 0xf0, 0x01, 0x3f, 0xfd, 0xb7, 0x6c, 0x3e, 0xf6, 0x75, 0x27, 0x3f,
  0xe8, 0x6c, 0x6f, 0x3e, 0xe6, 0x43, 0x27, 0x3f, 0xac, 0x1d, 0x0d, 0x3e, 0xb8, 0x42, 0x01, 0x3f,
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
  0x00, 0x01, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x84, 0x00, 0x06, 0x04, 0x05, 0x06, 0x05, 0x04, 0x06,
  0x06, 0x05, 0x06, 0x07, 0x07, 0x06, 0x08, 0x0a, 0x10, 0x0a, 0x0a, 0x09, 0x09, 0x0a, 0x14, 0x0e,
  0x0f, 0x0c, 0x10, 0x17, 0x14, 0x18, 0x18, 0x17, 0x14, 0x16, 0x16, 0x1a, 0x1d, 0x25, 0x1f, 0x1a,
  0x1b, 0x23, 0x1c, 0x16, 0x16, 0x20, 0x2c, 0x20, 0x23, 0x26, 0x27, 0x29, 0x2a, 0x29, 0x19, 0x1f,
  0x2d, 0x30, 0x2d, 0x28, 0x30, 0x25, 0x28, 0x29, 0x28, 0x01, 0x07, 0x07, 0x07, 0x0a, 0x08, 0x0a,
  0x13, 0x0a, 0x0a, 0x13, 0x28, 0x1a, 0x16, 0x1a, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28,
  0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28,
  0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28,
  0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0x28, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00,
  0x20, 0x00, 0x40, 0x03, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, 0xff, 0xc4, 0x01,
  0xa2, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x10, 0x00,
  0x02, 0x01, 0x03, 0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7d, 0x01,
  0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07, 0x22,
  0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08, 0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0, 0x24,
  0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28, 0x29,
  0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a,
  0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a,
  0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a,
  0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8,
  0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6,
  0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2, 0xe3,
  0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,
  0xfa, 0x01, 0x00, 0x03, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x11, 0x00,
  0x02, 0x01, 0x02, 0x04, 0x04, 0x03, 0x04, 0x07, 0x05, 0x04, 0x04, 0x00, 0x01, 0x02, 0x77, 0x00,
  0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21, 0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71, 0x13,
  0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91, 0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0, 0x15,
  0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34, 0xe1, 0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26, 0x27,
  0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
  0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
  0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88,
  0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6,
  0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4,
  0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe2,
  0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,
  0xfa, 0xff, 0xda, 0x00, 0x0c, 0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3f, 0x00, 0xf9,
  0x52, 0x80, 0x0a, 0x00, 0x5a, 0x2e, 0x01, 0x45, 0xc0, 0x28, 0x00, 0xa0, 0x61, 0x45, 0xc4, 0x25,
  0x00, 0x7d, 0xb5, 0x51, 0x72, 0xec, 0x6a, 0xe8, 0x9d, 0x3f, 0xed, 0xaf, 0xf4, 0xa2, 0xe1, 0x62,
  0x5b, 0x8f, 0xf5, 0xa6, 0xa6, 0xe2, 0xb1, 0x1d, 0x17, 0x0b, 0x1e, 0x73, 0x5d, 0x0d, 0x18, 0xa6,
  0x74, 0x96, 0xff, 0x00, 0xbe, 0xb2, 0x8a, 0x7e, 0x9e, 0x61, 0x23, 0x1e, 0x98, 0xac, 0x99, 0x69,
  0x92, 0x54, 0x26, 0x33, 0xe2, 0xea, 0xd5, 0x01, 0xf5, 0x9d, 0xe7, 0x88, 0xd6, 0xd6, 0x31, 0x05,
  0xac, 0x5e, 0x64, 0xaa, 0x00, 0x2c, 0xdd, 0x01, 0x18, 0xed, 0xdf, 0xbf, 0xa5, 0x30, 0x73, 0x33,
  0xb4, 0xfb, 0x8d, 0x5a, 0xea, 0x5c, 0xc5, 0x7f, 0x71, 0x1e, 0xf6, 0x27, 0xfd, 0x73, 0xa0, 0xcf,
  0xe1, 0x41, 0x0e, 0x46, 0xed, 0xb5, 0x9e, 0xb2, 0xaa, 0x82, 0x6d, 0x6a, 0x5e, 0x0f, 0xcc, 0x02,
  0xef, 0x38, 0xcf, 0xf7, 0xcf, 0x35, 0x0c, 0xb3, 0x40, 0x2b, 0xa2, 0x81, 0x35, 0xc4, 0xb7, 0x07,
  0x39, 0xcc, 0xa4, 0x64, 0x7e, 0x40, 0x54, 0xb0, 0x39, 0xa4, 0x56, 0x91, 0xf6, 0xa0, 0x24, 0x9e,
  0xc0, 0x56, 0xad, 0x92, 0x91, 0xd2, 0xdb, 0x27, 0x93, 0xa7, 0xdb, 0xc2, 0xe4, 0x79, 0x83, 0x24,
  0xe3, 0xb6, 0x6b, 0x26, 0x50, 0xea, 0x48, 0x0f, 0x8b, 0xab, 0x54, 0x07, 0xd2, 0x31, 0xc5, 0x1b,
  0x4b, 0x99, 0x1b, 0x09, 0xe9, 0xeb, 0x4c, 0xca, 0xc7, 0x41, 0xa7, 0x8f, 0x2e, 0xee, 0x2c, 0xe1,
  0x10, 0x7e, 0x43, 0x8a, 0x0a, 0x51, 0x3a, 0x5a, 0x86, 0x58, 0x54, 0xb0, 0x23, 0x8e, 0x34, 0x8f,
  0x25, 0x14, 0x02, 0xe7, 0x24, 0xfa, 0xd1, 0x70, 0x12, 0x4e, 0x4f, 0x14, 0xca, 0x48, 0x2a, 0x51,
  0x27, 0xc5, 0xd5, 0xaa, 0x03, 0xff, 0xd9, 0x00, 0x0a, 0x70, 0x72, 0x65, 0x63, 0x69, 0x73, 0x69,
  0x6f, 0x6e, 0x20, 0x68, 0x69, 0x67, 0x68, 0x70, 0x20, 0x66, 0x6c, 0x6f, 0x61, 0x74, 0x3b, 0x0a,
  0x75, 0x6e, 0x69, 0x66, 0x6f, 0x72, 0x6d, 0x20, 0x6d, 0x61, 0x74, 0x34, 0x20, 0x75, 0x5f, 0x6d,
  0x6f, 0x64, 0x65, 0x6c, 0x56, 0x69, 0x65, 0x77, 0x4d, 0x61, 0x74, 0x72, 0x69, 0x78, 0x3b, 0x0a,
  0x75, 0x6e, 0x69, 0x66, 0x6f, 0x72, 0x6d, 0x20, 0x6d, 0x61, 0x74, 0x34, 0x20, 0x75, 0x5f, 0x70,
  0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x4d, 0x61, 0x74, 0x72, 0x69, 0x78, 0x3b,
  0x0a, 0x61, 0x74, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x20, 0x76, 0x65, 0x63, 0x33, 0x20,
  0x61, 0x5f, 0x70, 0x6f, 0x73, 0x69, 0x74, 0x69, 0x6f, 0x6e, 0x3b, 0x0a, 0x61, 0x74, 0x74, 0x72,
  0x69, 0x62, 0x75, 0x74, 0x65, 0x20, 0x76, 0x65, 0x63, 0x32, 0x20, 0x61, 0x5f, 0x74, 0x65, 0x78,
  0x63, 0x6f, 0x6f, 0x72, 0x64, 0x30, 0x3b, 0x0a, 0x61, 0x74, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74,
  0x65, 0x20, 0x66, 0x6c, 0x6f, 0x61, 0x74, 0x20, 0x61, 0x5f, 0x62, 0x61, 0x74, 0x63, 0x68, 0x69,
  0x64, 0x3b, 0x0a, 0x76, 0x61, 0x72, 0x79, 0x69, 0x6e, 0x67, 0x20, 0x76, 0x65, 0x63, 0x32, 0x20,
  0x76, 0x5f, 0x74, 0x65, 0x78, 0x63, 0x6f, 0x6f, 0x72, 0x64, 0x30, 0x3b, 0x0a, 0x76, 0x6f, 0x69,
  0x64, 0x20, 0x6d, 0x61, 0x69, 0x6e, 0x28, 0x76, 0x6f, 0x69, 0x64, 0x29, 0x0a, 0x7b, 0x20, 0x20,
  0x20, 0x0a, 0x20, 0x20, 0x20, 0x20, 0x76, 0x5f, 0x74, 0x65, 0x78, 0x63, 0x6f, 0x6f, 0x72, 0x64,
  0x30, 0x20, 0x3d, 0x20, 0x61, 0x5f, 0x74, 0x65, 0x78, 0x63, 0x6f, 0x6f, 0x72, 0x64, 0x30, 0x3b,
  0x0a, 0x20, 0x20, 0x20, 0x20, 0x67, 0x6c, 0x5f, 0x50, 0x6f, 0x73, 0x69, 0x74, 0x69, 0x6f, 0x6e,
  0x20, 0x3d, 0x20, 0x75, 0x5f, 0x70, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x4d,
  0x61, 0x74, 0x72, 0x69, 0x78, 0x20, 0x2a, 0x20, 0x75, 0x5f, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x56,
  0x69, 0x65, 0x77, 0x4d, 0x61, 0x74, 0x72, 0x69, 0x78, 0x20, 0x2a, 0x20, 0x76, 0x65, 0x63, 0x34,
  0x28, 0x61, 0x5f, 0x70, 0x6f, 0x73, 0x69, 0x74, 0x69, 0x6f, 0x6e, 0x2c, 0x20, 0x31, 0x2e, 0x30,
  0x29, 0x3b, 0x0a, 0x7d, 0x0a, 0x00, 0x00, 0x00, 0x0a, 0x70, 0x72, 0x65, 0x63, 0x69, 0x73, 0x69,
  0x6f, 0x6e, 0x20, 0x68, 0x69, 0x67, 0x68, 0x70, 0x20, 0x66, 0x6c, 0x6f, 0x61, 0x74, 0x3b, 0x0a,
  0x76, 0x61, 0x72, 0x79, 0x69, 0x6e, 0x67, 0x20, 0x76, 0x65, 0x63, 0x32, 0x20, 0x76, 0x5f, 0x74,
  0x65, 0x78, 0x63, 0x6f, 0x6f, 0x72, 0x64, 0x30, 0x3b, 0x0a, 0x75, 0x6e, 0x69, 0x66, 0x6f, 0x72,
  0x6d, 0x20, 0x73, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x72, 0x32, 0x44, 0x20, 0x75, 0x5f, 0x64, 0x69,
  0x66, 0x66, 0x75, 0x73, 0x65, 0x3b, 0x0a, 0x76, 0x6f, 0x69, 0x64, 0x20, 0x6d, 0x61, 0x69, 0x6e,
  0x28, 0x76, 0x6f, 0x69, 0x64, 0x29, 0x0a, 0x7b, 0x0a, 0x20, 0x20, 0x67, 0x6c, 0x5f, 0x46, 0x72,
  0x61, 0x67, 0x43, 0x6f, 0x6c, 0x6f, 0x72, 0x20, 0x3d, 0x20, 0x74, 0x65, 0x78, 0x74, 0x75, 0x72,
  0x65, 0x32, 0x44, 0x28, 0x75, 0x5f, 0x64, 0x69, 0x66, 0x66, 0x75, 0x73, 0x65, 0x2c, 0x20, 0x76,
  0x5f, 0x74, 0x65, 0x78, 0x63, 0x6f, 0x6f, 0x72, 0x64, 0x30, 0x29, 0x3b, 0x0a, 0x7d, 0x0a, 0x00,
]);

describe("B3dmReader", () => {
  let imodel: SnapshotConnection;

  before(async () => {
    await TestUtility.startFrontend(undefined, true);
    imodel = await SnapshotConnection.openFile("test.bim");
  });

  after(async () => {
    await imodel.close();
    await TestUtility.shutdownFrontend();
  });

  it("should locate texture for mesh", async () => {
    class Texture extends RenderTexture {
      public constructor(type: RenderTexture.Type) { super(type); }
      public dispose() { }
      public get bytesUsed() { return 0; }
    }

    let textureCreated = false;
    IModelApp.renderSystem.createTexture = () => {
      expect(textureCreated).to.be.false;
      textureCreated = true;
      return new Texture(RenderTexture.Type.Normal);
    };

    let texturedMeshCreated = false;
    IModelApp.renderSystem.createTriMesh = (args: any) => {
      expect(texturedMeshCreated).to.be.false;
      texturedMeshCreated = undefined !== args.texture;
      return new MockRender.Graphic();
    };

    const stream = new ByteStream(b3dmBytes.buffer);
    const renderSystem = IModelApp.renderSystem;
    const range = Range3d.createXYZXYZ(0, 0, 0, 10, 10, 10);
    const reader = B3dmReader.create(stream, imodel, "0x123", true, range, renderSystem, false, true, range.center)!;
    expect(reader).not.to.be.undefined;

    // The technique specifies a uniform sampler2d named "u_diffuse".
    const extensions = (reader as any)._extensions;
    expect(extensions).not.to.be.undefined;
    const uniformType = extensions.KHR_techniques_webgl?.techniques[0]?.uniforms?.u_diffuse?.type;
    expect(typeof uniformType).to.equal("number");
    expect(uniformType).to.equal(GltfDataType.Sampler2d);

    // The material specifies the value for the "u_diffuse" uniform.
    const materials = (reader as any)._materialValues;
    expect(materials).not.to.be.undefined;
    const materialExtension = materials[0]?.extensions?.KHR_techniques_webgl;
    expect(typeof materialExtension).to.equal("object");
    expect(materialExtension.technique).to.equal(0);
    expect(materialExtension.values?.u_diffuse?.index).to.equal(0);

    const result = await reader.read();
    expect(result.graphic).not.to.be.undefined;

    expect(textureCreated).to.be.true;
    expect(texturedMeshCreated).to.be.true;
  });
});
