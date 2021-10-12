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

/** Properties for the [[RgbaColorInputPanel]] React component
 * @internal
 */
export interface RgbaColorInputPanelProps {
  /** Active color value */
  color: { r: number, g: number, b: number };
  /** value 0 (transparent)-1(opaque), if undefined then alpha value is not shown */
  currentAlpha?: number;
  /** call back function to call when the active color changes */
  onRedChange: (value: number | undefined, stringValue: string) => void;
  /** call back function to call when the active color changes */
  onGreenChange: (value: number | undefined, stringValue: string) => void;
  /** call back function to call when the active color changes */
  onBlueChange: (value: number | undefined, stringValue: string) => void;
  /** call back function to call when the active color changes */
  onAlphaChange?: (value: number | undefined, stringValue: string) => void;
  onToggleMode?: () => void;
}
/**
 * Rgba Color Input panel.
 * @internal
 */
export function RgbaColorInputPanel(props: RgbaColorInputPanelProps) {
  const { color, onRedChange, onGreenChange, onBlueChange, currentAlpha, onAlphaChange, onToggleMode } = props;

  return (
    <div data-testid="components-colorpicker-input-panel" className="components-colorpicker-input-panel">
      <ColorInputValue value={color.r} onValueChange={onRedChange} label="R" labelLocation="bottom" onToggleMode={onToggleMode} min={0} max={255} />
      <ColorInputValue value={color.g} onValueChange={onGreenChange} label="G" labelLocation="bottom" min={0} max={255} />
      <ColorInputValue value={color.b} onValueChange={onBlueChange} label="B" labelLocation="bottom" min={0} max={255} />
      {(undefined !== currentAlpha) &&
        <AlphaInputValue value={currentAlpha} onValueChange={onAlphaChange} label="A" labelLocation="bottom" />}
    </div>
  );
}
