import React, { useState, useCallback, useEffect, useMemo } from "react";
import styled from "ui-toolkit/styled-components";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { PanelType, Panel as FabricPanel, IPanelProps } from "office-ui-fabric-react/lib/Panel";
import IFramePanel from "./IFramePanel";

export interface PanelOptions {
  /** Defaults to false. Should the panel be open by default? */
  startOpen?: boolean;
  /** The size of the panel. "small", "medium", "large", or a Number */
  size?: PanelSize;

  close?: () => void;
  open?: () => void;
  controlledIsOpen?: boolean;
}
let defaults: PanelOptions = {
  startOpen: false,
  size: "medium",
};

export function usePanel(opts: PanelOptions = {}) {
  let { startOpen, size, open, close, controlledIsOpen } = { ...defaults, ...opts };
  let [isOpen, setIsOpen] = useState(startOpen);

  let openPanel = useMemo(() => {
    if (open) return open;
    return () => setIsOpen(true);
  }, [setIsOpen, open]);

  let closePanel = useMemo(() => {
    if (close) return close;
    return () => setIsOpen(false);
  }, [setIsOpen, close]);

  useEffect(() => {
    setIsOpen(controlledIsOpen);
  }, [controlledIsOpen]);

  useEffect(() => listenForPanelClose(closePanel));

  let panelProps = {
    isOpen,
    onDismiss: closePanel,
    isLightDismiss: true,
    type: getPanelType(size),
    customWidth: typeof size === "number" ? size + "px" : undefined,
    onRenderNavigation: () => (
      <StyledClose>
        <IconButton iconProps={{ iconName: "ChromeClose" }} onClick={closePanel} />
      </StyledClose>
    ),
  };

  return {
    isOpen,
    openPanel,
    closePanel,
    panelProps,
    Panel,
  } as UsePanelResult;
}

export interface PanelProps extends IPanelProps {
  url?: string;
}

export const Panel: React.FC<PanelProps> = function ({ url, ...panelProps }) {
  if (url) return <IFramePanel url={url} {...panelProps} />;

  return <FabricPanel {...panelProps} />;
};
export interface UsePanelResult {
  /** Whether the panel is currently open */
  isOpen: boolean;
  /** A function you can call to open the panel */
  openPanel: () => void;
  /** A function you can call to close the panel */
  closePanel: () => void;
  /** The props you should spread onto the Panel component */
  panelProps: IPanelProps;
  /** The hook returns the UI Fabric Panel component as a nicety so you don't have to mess with importing it */
  Panel?: any;
}

export interface FabricPanelProps extends IPanelProps {}

export type PanelSize = "small" | "medium" | "large" | number;

const getPanelType = (size) => {
  if (size === "small") {
    return PanelType.smallFixedFar;
  }
  if (size === "medium") {
    return PanelType.medium;
  }
  if (size === "large") {
    return PanelType.large;
  }
  if (typeof size !== "string") {
    return PanelType.custom;
  }
  return PanelType.medium;
};
const CLOSE_MSG_TYPE = "CLOSE_PANEL";

// The parent window should create a panel then wire up this function
// to listen for anyone inside the IFrame trying to close the panel;
export const listenForPanelClose = function (cb: () => void) {
  let handler = (event) => {
    try {
      let msg = JSON.parse(event.data);
      if (msg.type === CLOSE_MSG_TYPE) {
        cb();
      }
    } catch (err) {
      // Couldn't parse json
    }
  };
  window.addEventListener("message", handler, false);
  return () => {
    window.removeEventListener("message", handler);
  };
};

export const triggerPanelClose = function () {
  let msg = JSON.stringify({
    type: CLOSE_MSG_TYPE,
  });
  window.top.postMessage(msg, "*");
};

const StyledClose = styled.div`
  position: absolute;
  top: 5px;
  right: 23px;
  z-index: 10;
  background: #ffffffbf;
  border-radius: 50%;
  opacity: 0.85;
  &:hover {
    opacity: 1;
  }
`;
