import React from "react";
import { usePanel, PanelProps } from "./usePanel";
import { Panel as FabricPanel, IPanelProps } from "office-ui-fabric-react/lib/Panel";
import styled from "ui-toolkit/styled-components";

export const IFramePanel: React.FC<PanelProps> = function ({ url, ...panelProps }) {
  return (
    <FabricPanel {...panelProps}>
      <StyledIFrameWrapper className="iframe-wrapper">
        <iframe src={url} frameBorder="0"></iframe>
      </StyledIFrameWrapper>
    </FabricPanel>
  );
};

export default IFramePanel;

const StyledIFrameWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  iframe {
    height: 100%;
    width: 100%;
  }
`;
