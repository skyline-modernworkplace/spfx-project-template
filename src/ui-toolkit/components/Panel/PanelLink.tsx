import React, { useEffect } from "react";
import { initializeIcons } from "@uifabric/icons";
import { HyperLink } from "../primitives/Link";
import { IFramePanel } from "../Panel/IFramePanel";
import { usePanel } from "../Panel/usePanel";

initializeIcons();

export function PanelLink({
  href,
  title,
  children,
  panelSize = "medium",
  ...additionalProps
}: PanelLinkProps) {
  let { panelProps, openPanel } = usePanel({ size: panelSize });

  const handleLinkClick = (e) => {
    e.preventDefault();
    openPanel();
    if (additionalProps.onClick) {
      additionalProps.onClick(e);
    }
  };

  return (
    <>
      <HyperLink {...additionalProps} href={href} onClick={handleLinkClick}>
        {children}
      </HyperLink>
      <IFramePanel {...panelProps} url={href} />
    </>
  );
}

export default PanelLink;

export interface PanelLinkProps {
  href: string;
  title?: string;
  panelSize?: "small" | "medium" | "large" | number;
  children?: any;
  [key: string]: any;
}
