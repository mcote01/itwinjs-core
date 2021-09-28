/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Color
 */

// cSpell:ignore colorpicker

import * as React from "react";
import { ColorDef, HSVColor } from "@bentley/imodeljs-common";
import { ColorSwatch } from "./Swatch";
import { HueSlider } from "./HueSlider";
import { SaturationPicker } from "./SaturationPicker";
import "./ColorPickerPanel.scss";
import { NumberInput } from "@bentley/ui-core";

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
  colorInputType?: "HSL" | "RGB";
}

/**
 * Color Picker Panel that can be used in dialogs or popups.
 * @public
 */
// istanbul ignore next
export function ColorPickerPanel({ activeColor, onColorChange, colorPresets, colorInputType }: ColorPickerPanelProps) {
  const [currentHsv, setCurrentHsv] = React.useState(() => activeColor.toHSV());
  const activeColorPropRef = React.useRef(activeColor.tbgr);
  const activeColorValue = activeColor.tbgr;

  // The following code is used to preserve the Hue after initial mount. If the current HSV value produces the same rgb value
  // as the activeColor prop then leave the HSV color unchanged. This prevents the jumping of HUE as the s/v values are changed
  // by user moving the pointer.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    // see if incoming color is different than original color
    if (activeColorPropRef.current !== activeColorValue) {
      activeColorPropRef.current = activeColorValue;
      const hsvColorValue = currentHsv.toColorDef().tbgr;
      if (activeColorValue !== hsvColorValue) {
        setCurrentHsv(activeColor.toHSV());
      }
    }
  }, [activeColor, activeColorValue, currentHsv]);

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
      {(colorInputType === "RGB") &&
        <div data-testid="components-colorpicker-input-panel" className="components-colorpicker-input-panel">
          <div className="components-colorpicker-input-value-wrapper">
            <span className="uicore-inputs-labeled-input">R</span>
            <NumberInput data-testid="components-colorpicker-input-value-red" value={color.r} onChange={handleRedChange} min={0} max={255} />
          </div>
          <div className="components-colorpicker-input-value-wrapper">
            <span className="uicore-inputs-labeled-input">G</span>
            <NumberInput data-testid="components-colorpicker-input-value-green" value={color.g} onChange={handleGreenChange} min={0} max={255} />
          </div>
          <div className="components-colorpicker-input-value-wrapper">
            <span className="uicore-inputs-labeled-input">B</span>
            <NumberInput data-testid="components-colorpicker-input-value-blue" value={color.b} onChange={handleBlueChange} min={0} max={255} />
          </div>
        </div>}
      {(colorInputType === "HSL") &&
        <div data-testid="components-colorpicker-input-panel" className="components-colorpicker-input-panel">
          <div className="components-colorpicker-input-value-wrapper">
            <span className="uicore-inputs-labeled-input">H</span>
            <NumberInput data-testid="components-colorpicker-input-value-hue" value={Math.round(currentHsl.h * 360)} onChange={handleHueValueChange} min={0} max={360} />
          </div>
          <div className="components-colorpicker-input-value-wrapper">
            <span className="uicore-inputs-labeled-input">S</span>
            <NumberInput data-testid="components-colorpicker-input-value-saturation" value={Math.round(currentHsl.s * 100)} onChange={handleSaturationValueChange} min={0} max={100} />
          </div>
          <div className="components-colorpicker-input-value-wrapper">
            <span className="uicore-inputs-labeled-input">L</span>
            <NumberInput data-testid="components-colorpicker-input-value-lightness" value={Math.round(currentHsl.l * 100)} onChange={handleLightnessValueChange} min={0} max={100} />
          </div>
        </div>}

      {
        colorPresets && colorPresets.length &&
        <div className="components-colorpicker-panel-presets">
          {colorPresets.map((preset, index) => <ColorSwatch className="components-colorpicker-panel-swatch" key={index} colorDef={preset} round={false} onColorPick={handlePresetColorPick} />)}
        </div>
      }
    </div>
  );
}
