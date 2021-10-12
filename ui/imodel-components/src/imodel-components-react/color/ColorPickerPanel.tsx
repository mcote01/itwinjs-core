/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Color
 */

// cSpell:ignore colorpicker

import * as React from "react";
import { ColorDef, HSVColor } from "@itwin/core-common";
import { ColorSwatch } from "./Swatch";
import { HueSlider } from "./HueSlider";
import { SaturationPicker } from "./SaturationPicker";
import "./ColorPickerPanel.scss";
import { AlphaSlider } from "./AlphaSlider";
import { getCSSColorFromDef } from "./getCSSColorFromDef";
import { RgbaColorInputPanel } from "./RgbaColorInputPanel";
import { HslaColorInputPanel } from "./HslaColorInputPanel";

/** Properties for the [[ColorPickerPanel]] React component
 * @public
 */
export interface ColorPickerPanelProps {
  /** Active color value */
  activeColor: ColorDef;
  /** call back function to call when the active color changes */
  onColorChange: (selectedColor: ColorDef) => void;
  /** If defined then an array of color swatches are displayed */
  colorPresets?: ColorDef[];
  /** If set show either HSL or RGB input values. If undefined no input value is shown */
  defaultColorInputType?: "HSL" | "RGB";
  /** If true then alpha value is also shown so it can be set. */
  showAlpha?: boolean;
}

/**
 * Color Picker Panel that can be used in dialogs or popups.
 * @public
 */
// istanbul ignore next
export function ColorPickerPanel({ activeColor, onColorChange, colorPresets, defaultColorInputType, showAlpha }: ColorPickerPanelProps) {
  const [currentHsv, setCurrentHsv] = React.useState(() => activeColor.toHSV());
  const [currentMode, setCurrentMode] = React.useState(() => defaultColorInputType);
  const [currentAlpha, setCurrentAlpha] = React.useState(() => activeColor.getAlpha() / 255); // 0-1
  const activeColorValueRef = React.useRef(activeColor.tbgr);
  const activeColorValue = activeColor.tbgr;

  // The following code is used to preserve the Hue after initial mount. If the current HSV value produces the same rgb value
  // as the activeColor prop then leave the HSV color unchanged. This prevents the jumping of HUE as the s/v values are changed
  // by user moving the pointer.
  React.useEffect(() => {
    // see if incoming color is different than original color
    if (activeColorValueRef.current !== activeColorValue) {
      activeColorValueRef.current = activeColorValue;
      const hsvColorValue = currentHsv.toColorDef().tbgr;
      if (activeColorValue !== hsvColorValue) {
        setCurrentHsv(activeColor.toHSV());
      }
    }
  }, [activeColor, activeColorValue, currentHsv]);

  const handleToggleMode = React.useCallback(() => {
    setCurrentMode(currentMode === "HSL" ? "RGB" : "HSL");
  }, [currentMode]);

  const handlePresetColorPick = React.useCallback((newColor: ColorDef, e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();
    if (onColorChange) {
      onColorChange(newColor);
    }
  }, [onColorChange]);

  const handleHueChange = React.useCallback((newHsvColor: HSVColor) => {
    setCurrentHsv(newHsvColor);
    const newColorDef = newHsvColor.toColorDef();
    if (onColorChange) {
      onColorChange(newColorDef);
    }
  }, [onColorChange]);

  const handleSaturationChange = React.useCallback((newHsvColor: HSVColor) => {
    const newColorDef = newHsvColor.toColorDef();
    setCurrentHsv(newHsvColor);
    if (onColorChange) {
      onColorChange(newColorDef);
    }
  }, [onColorChange]);

  const currentHsl = React.useMemo(() => activeColor.toHSL(), [activeColor]);
  const color = React.useMemo(() => activeColor.colors, [activeColor]);

  const handleLightnessValueChange = React.useCallback((value: number | undefined, _stringValue: string) => {
    const newHsl = currentHsl.clone(undefined, undefined, (value ?? 0) / 100);
    if (onColorChange) {
      const newColorDef = newHsl.toColorDef();
      onColorChange(newColorDef);
    }
  }, [currentHsl, onColorChange]);

  const handleHueValueChange = React.useCallback((value: number | undefined, _stringValue: string) => {
    const newHsl = currentHsl.clone((value ?? 0) / 360, undefined, undefined);

    if (onColorChange) {
      const newColorDef = newHsl.toColorDef();
      onColorChange(newColorDef);
    }
  }, [currentHsl, onColorChange]);

  const handleSaturationValueChange = React.useCallback((value: number | undefined, _stringValue: string) => {
    if (undefined !== value) {
      const newHsl = currentHsl.clone(undefined, value / 100, undefined);
      if (onColorChange) {
        const newColorDef = newHsl.toColorDef();
        onColorChange(newColorDef);
      }
    }
  }, [currentHsl, onColorChange]);

  const handleRedChange = React.useCallback((value: number | undefined, _stringValue: string) => {
    if (undefined !== value) {
      const newColorDef = ColorDef.from(value, color.g, color.b);
      setCurrentHsv(newColorDef.toHSV());
      if (onColorChange) {
        onColorChange(newColorDef);
      }
    }
  }, [color, onColorChange]);

  const handleGreenChange = React.useCallback((value: number | undefined, _stringValue: string) => {
    if (undefined !== value) {
      const newColorDef = ColorDef.from(color.r, value, color.b);
      setCurrentHsv(newColorDef.toHSV());
      if (onColorChange) {
        onColorChange(newColorDef);
      }
    }
  }, [color, onColorChange]);

  const handleBlueChange = React.useCallback((value: number | undefined, _stringValue: string) => {
    if (undefined !== value) {
      const newColorDef = ColorDef.from(color.r, color.g, value);
      setCurrentHsv(newColorDef.toHSV());
      if (onColorChange) {
        onColorChange(newColorDef);
      }
    }
  }, [color, onColorChange]);

  const handleAlphaValueChange = React.useCallback((value: number | undefined, _stringValue: string) => {
    if (undefined !== value) {
      setCurrentAlpha(value);
    }
  }, []);

  const handleAlphaChange = React.useCallback((alpha) => {
    setCurrentAlpha(alpha);
  }, []);

  const resultingColorDef = currentHsv.toColorDef().withAlpha(currentAlpha * 255);

  const rgbaString = getCSSColorFromDef(resultingColorDef);
  const colorStyle: React.CSSProperties = { backgroundColor: rgbaString };

  return (
    <div data-testid="components-colorpicker-panel" className="components-colorpicker-panel">
      <div className="components-colorpicker-panel-color">
        <div className="components-colorpicker-saturation">
          <SaturationPicker hsv={currentHsv} onSaturationChange={handleSaturationChange} />
        </div>
        <div className="components-colorpicker-hue">
          <HueSlider hsv={currentHsv} onHueChange={handleHueChange} isHorizontal={false} />
        </div>
      </div>
      {showAlpha &&
        <div className="components-colorpicker-alpha-swatch-container">
          <AlphaSlider isHorizontal alpha={currentAlpha} onAlphaChange={handleAlphaChange} />
          <div className="components-colorpicker-alpha-preview-container">
            <div className="components-color-swatch components-colorpicker-alpha-preview" style={colorStyle}></div>
          </div>
        </div>
      }
      {(currentMode === "RGB") &&
        <RgbaColorInputPanel color={color} onRedChange={handleRedChange} onGreenChange={handleGreenChange} onToggleMode={handleToggleMode}
          onBlueChange={handleBlueChange} onAlphaChange={handleAlphaValueChange} currentAlpha={showAlpha ? currentAlpha : undefined} />
      }
      {(currentMode === "HSL") &&
        <HslaColorInputPanel hslColor={currentHsl} onHueChange={handleHueValueChange} onSaturationChange={handleSaturationValueChange} onToggleMode={handleToggleMode}
          onLightnessChange={handleLightnessValueChange} onAlphaChange={handleAlphaValueChange} currentAlpha={showAlpha ? currentAlpha : undefined} />
      }
      {
        colorPresets && colorPresets.length &&
        <div className="components-colorpicker-panel-presets">
          {colorPresets.map((preset, index) => <ColorSwatch className="components-colorpicker-panel-swatch" key={index} colorDef={preset} round={false} onColorPick={handlePresetColorPick} />)}
        </div>
      }
    </div >
  );
}
