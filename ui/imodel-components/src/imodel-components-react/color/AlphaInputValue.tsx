/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Color
 */

import * as React from "react";
import { NumberInput } from "@itwin/core-react";

/** Properties for the [[AlphaColorInput]] React component
 * @internal
 */
export interface AlphaInputValueProps {
  /** Active color value 0-255 */
  value: number;
  /** value label */
  label: string;
  /** call back function to call when the alpha value changes */
  onValueChange?: (value: number | undefined, stringValue: string) => void;
  /** label location */
  labelLocation: "top" | "bottom";
}

/**
 * Alpha Input.
 * @internal
 */
export function AlphaInputValue(props: AlphaInputValueProps) {
  const { value, label, labelLocation, onValueChange } = props;
  const className = (labelLocation === "top") ? "components-colorpicker-input-value-wrapper" :
    "components-colorpicker-input-value-wrapper  reversed";

  return (
    <div className={className}>
      <span className="uicore-inputs-input-label">{label}</span>
      <NumberInput data-testid="components-colorpicker-input-value-alpha" precision={2} value={value}
        onChange={onValueChange} min={0} max={1} step={0.05} />
    </div>
  );
}
