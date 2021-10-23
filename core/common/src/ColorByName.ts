/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Symbology
 */

// spell-checker: disable
/** A set of known colors by [HTML color name](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value), as a 32-bit integer in the form 0xBBGGRR (red is the low byte).
 * This is different than color values in #RRGGBB format for HTML pages (red and blue are swapped).
 * @note If your colors don't look right, likely you're using 0xRRGGBB where ColorDef expects 0xBBGGRR.
 * @public
 */
export enum ColorByName {
  aliceBlue = 0xFFF8F0,
  amber = 0x00BFFF,
  antiqueWhite = 0xD7EBFA,
  aqua = 0xFFFF00,
  aquamarine = 0xD4FF7F,
  azure = 0xFFFFF0,
  beige = 0xDCF5F5,
  bisque = 0xC4E4FF,
  black = 0x000000,
  blanchedAlmond = 0xCDEBFF,
  blue = 0xFF0000,
  blueViolet = 0xE22B8A,
  brown = 0x2A2AA5,
  burlyWood = 0x87B8DE,
  cadetBlue = 0xA09E5F,
  chartreuse = 0x00FF7F,
  chocolate = 0x1E69D2,
  coral = 0x507FFF,
  cornflowerBlue = 0xED9564,
  cornSilk = 0xDCF8FF,
  crimson = 0x3C14DC,
  cyan = 0xFFFF00,
  darkBlue = 0x8B0000,
  darkBrown = 0x214365,
  darkCyan = 0x8B8B00,
  darkGoldenrod = 0x0B86B8,
  darkGray = 0xA9A9A9,
  darkGreen = 0x006400,
  darkGrey = 0xA9A9A9,
  darkKhaki = 0x6BB7BD,
  darkMagenta = 0x8B008B,
  darkOliveGreen = 0x2F6B55,
  darkOrange = 0x008CFF,
  darkOrchid = 0xCC3299,
  darkRed = 0x00008B,
  darkSalmon = 0x7A96E9,
  darkSeagreen = 0x8FBC8F,
  darkSlateBlue = 0x8B3D48,
  darkSlateGray = 0x4F4F2F,
  darkSlateGrey = 0x4F4F2F,
  darkTurquoise = 0xD1CE00,
  darkViolet = 0xD30094,
  deepPink = 0x9314FF,
  deepSkyBlue = 0xFFBF00,
  dimGray = 0x696969,
  dimGrey = 0x696969,
  dodgerBlue = 0xFF901E,
  fireBrick = 0x2222B2,
  floralWhite = 0xF0FAFF,
  forestGreen = 0x228B22,
  fuchsia = 0xFF00FF,
  gainsboro = 0xDCDCDC,
  ghostWhite = 0xFFF8F8,
  gold = 0x00D7FF,
  goldenrod = 0x20A5DA,
  gray = 0x808080,
  green = 0x008000,
  greenYellow = 0x2FFFAD,
  grey = 0x808080,
  honeydew = 0xF0FFF0,
  hotPink = 0xB469FF,
  indianRed = 0x5C5CCD,
  indigo = 0x82004B,
  ivory = 0xF0FFFF,
  khaki = 0x8CE6F0,
  lavender = 0xFAE6E6,
  lavenderBlush = 0xF5F0FF,
  lawnGreen = 0x00FC7C,
  lemonChiffon = 0xCDFAFF,
  lightBlue = 0xE6D8AD,
  lightCoral = 0x8080F0,
  lightCyan = 0xFFFFE0,
  lightGoldenrodYellow = 0xD2FAFA,
  lightGray = 0xD3D3D3,
  lightGreen = 0x90EE90,
  lightGrey = 0xD3D3D3,
  lightPink = 0xC1B6FF,
  lightSalmon = 0x7AA0FF,
  lightSeagreen = 0xAAB220,
  lightSkyBlue = 0xFACE87,
  lightSlateGray = 0x998877,
  lightSlateGrey = 0x998877,
  lightSteelBlue = 0xDEC4B0,
  lightyellow = 0xE0FFFF,
  lime = 0x00FF00,
  limeGreen = 0x32CD32,
  linen = 0xE6F0FA,
  magenta = 0xFF00FF,
  maroon = 0x000080,
  mediumAquamarine = 0xAACD66,
  mediumBlue = 0xCD0000,
  mediumOrchid = 0xD355BA,
  mediumPurple = 0xDB7093,
  mediumSeaGreen = 0x71B33C,
  mediumSlateBlue = 0xEE687B,
  mediumSpringGreen = 0x9AFA00,
  mediumTurquoise = 0xCCD148,
  mediumVioletRed = 0x8515C7,
  midnightBlue = 0x701919,
  mintCream = 0xFAFFF5,
  mistyRose = 0xE1E4FF,
  moccasin = 0xB5E4FF,
  navajoWhite = 0xADDEFF,
  navy = 0x800000,
  oldLace = 0xE6F5FD,
  olive = 0x008080,
  oliveDrab = 0x238E6B,
  orange = 0x00A5FF,
  orangeRed = 0x0045FF,
  orchid = 0xD670DA,
  paleGoldenrod = 0xAAE8EE,
  paleGreen = 0x98FB98,
  paleTurquoise = 0xEEEEAF,
  paleVioletRed = 0x9370DB,
  papayaWhip = 0xD5EFFF,
  peachPuff = 0xB9DAFF,
  peru = 0x3F85CD,
  pink = 0xCBC0FF,
  plum = 0xDDA0DD,
  powderBlue = 0xE6E0B0,
  purple = 0x800080,
  rebeccaPurple = 0x993366,
  red = 0x0000FF,
  rosyBrown = 0x8F8FBC,
  royalBlue = 0xE16941,
  saddleBrown = 0x13458B,
  salmon = 0x7280FA,
  sandyBrown = 0x60A4F4,
  seaGreen = 0x578B2E,
  seaShell = 0xEEF5FF,
  sienna = 0x2D52A0,
  silver = 0xC0C0C0,
  skyBlue = 0xEBCE87,
  slateBlue = 0xCD5A6A,
  slateGray = 0x908070,
  slateGrey = 0x908070,
  snow = 0xFAFAFF,
  springGreen = 0x7FFF00,
  steelBlue = 0xB48246,
  tan = 0x8CB4D2,
  teal = 0x808000,
  thistle = 0xD8BFD8,
  tomato = 0x4763FF,
  turquoise = 0xD0E040,
  violet = 0xEE82EE,
  wheat = 0xB3DEF5,
  white = 0xFFFFFF,
  whiteSmoke = 0xF5F5F5,
  yellow = 0x00FFFF,
  yellowGreen = 0x32CD9A,
}
