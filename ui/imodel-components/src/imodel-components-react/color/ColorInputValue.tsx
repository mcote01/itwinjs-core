/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Color
 */

import * as React from "react";
import { NumberInput, WebFontIcon } from "@itwin/core-react";

/** Properties for the [[ColorInputValue]] React component
 * @internal
 */
export interface ColorInputValueProps {
  /** max value */
  max: number;
  /** min value */
  min: number;
  /** value min-max */
  value: number;
  /** value label */
  label: string;
  /** call back function to call when the active color changes */
  onValueChange?: (value: number | undefined, stringValue: string) => void;
  /** label location */
  labelLocation: "top" | "bottom";
  onToggleMode?: () => void;
}

/**
 * Color Input.
 * @internal
 */
export function ColorInputValue(props: ColorInputValueProps) {
  const { value, min, max, label, labelLocation, onValueChange, onToggleMode } = props;
  const className = (labelLocation === "top") ? "components-colorpicker-input-value-wrapper" :
    "components-colorpicker-input-value-wrapper  reversed";

  const labelElement = React.useMemo(() => {
    if (onToggleMode) {
      return <div className="uicore-inputs-input-label-and-mode-toggle">
        <WebFontIcon iconName="icon-chevron-down" onClick={onToggleMode} />
        {label}
      </div>;
    }
    return <span className="uicore-inputs-input-label">{label}</span>;
  }, [label, onToggleMode]);

  return (
    <div className={className}>
      {labelElement}
      <NumberInput data-testid={`components-colorpicker-input-value-${label}`} value={value} onChange={onValueChange} min={min} max={max} />
    </div>
  );
}
