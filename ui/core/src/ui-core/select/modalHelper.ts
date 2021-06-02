/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

/** getParentSelector
 * @internal
 */
export const getParentSelector = (innerDiv: HTMLDivElement | undefined): HTMLElement => {
  const ownerDocument = innerDiv?.ownerDocument??document;
  let portal = ownerDocument.querySelector("#portal");
  if (!portal) {
    portal = ownerDocument.createElement("div");
    portal.id = "portal";
    ownerDocument.body.appendChild(portal);
  }
  return portal as HTMLElement;
};
