/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Color
 */

import * as React from "react";
import { AlphaInputValue } from "./AlphaInputValue";
import { ColorInputValue } from "./ColorInputValue";

/** Properties for the [[HslaColorInputPanel]] React component
 * @internal
 */
export interface HslaColorInputPanelProps {
  /** Active color value */
  hslColor: { h: number, s: number, l: number };
  /** value 0 (transparent)-1(opaque), if undefined then alpha value is not shown */
  currentAlpha?: number;
  /** call back function to call when the active color changes */
  onHueChange: (value: number | undefined, stringValue: string) => void;
  /** call back function to call when the active color changes */
  onSaturationChange: (value: number | undefined, stringValue: string) => void;
  /** call back function to call when the active color changes */
  onLightnessChange: (value: number | undefined, stringValue: string) => void;
  /** call back function to call when the active color changes */
  onAlphaChange?: (value: number | undefined, stringValue: string) => void;
  onToggleMode?: () => void;
}

/**
 * Hsla Color Input panel.
 * @internal
 */
export function HslaColorInputPanel(props: HslaColorInputPanelProps) {
  const { hslColor, onHueChange, onSaturationChange, onLightnessChange, currentAlpha, onAlphaChange, onToggleMode } = props;
  return (
    <div data-testid="components-colorpicker-input-panel" className="components-colorpicker-input-panel">
      <ColorInputValue value={Math.round(hslColor.h * 360)} onValueChange={onHueChange} label="H" labelLocation="bottom" onToggleMode={onToggleMode} min={0} max={360} />
      <ColorInputValue value={Math.round(hslColor.s * 100)} onValueChange={onSaturationChange} label="S" labelLocation="bottom" min={0} max={100} />
      <ColorInputValue value={Math.round(hslColor.l * 100)} onValueChange={onLightnessChange} label="L" labelLocation="bottom" min={0} max={100} />
      {(undefined !== currentAlpha) &&
        <AlphaInputValue value={currentAlpha} onValueChange={onAlphaChange} label="A" labelLocation="bottom" />}
    </div>
  );
}
