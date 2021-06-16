import React from "react";

import Link from "../primitives/Link";
import styled from "ui-toolkit/styled-components";
import {
  IconImage,
  defaultIconImageProps,
  getIconFontSize,
  IconImageProps,
} from "../primitives/IconImage";
import { getThemeColor } from "../PortalsThemeProvider/PortalsThemeProvider";
const CLASS_NAME = "link-tile";

export function LinkTile(props: LinkTileProps) {
  let cssClass = [CLASS_NAME, props.className, props.showHoverOverlay === false ? "" : "hoverable"]
    .filter(Boolean)
    .join(" ");

  return (
    <StyledLinkContainer {...defaultIconImageProps} {...props} className={cssClass}>
      <IconImage {...props} />
      <StyledCaptionOverlay {...defaultIconImageProps} {...props} className="caption-overlay">
        {props.children}
      </StyledCaptionOverlay>
    </StyledLinkContainer>
  );
}
export default React.memo(LinkTile);

const getCaptionFontSize = function (width, height) {
  let smallerDimension = width < height ? width : height;
  return smallerDimension < 100 ? "12px" : smallerDimension > 175 ? "16px" : "14px";
};

const StyledCaptionOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  background: transparent;
  top: 60%;
  bottom: 0;
  left: 0;
  right: 0;
  color: ${(prop) => getThemeColor(prop.iconColor)};
  padding: 10px 5px;
  transition: top 0.2s ease-out, background-color 0.3s ease-out;
  font-size: ${(props) => getCaptionFontSize(props.width, props.height)};
  opacity: 0.8;
  pointer-events: none;
  .hoverable:hover & {
    top: 0;
    opacity: 1;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
    background: ${(props) => getThemeColor(props.hoverColor || "themeSecondary")};
  }
`;

const StyledLinkContainer = styled(Link)`
  display: inline-block;
  position: relative;
  .icon-image > i {
    margin-bottom: ${(props) => Math.floor(props.height * 0.2)}px;
    font-size: ${(props) => getIconFontSize(props.width, props.height, 40)};
  }
`;

export interface LinkTileProps extends IconImageProps {
  /** Url to the link */
  href: string;
  /** The child element will be rendered as the caption and appear in the hover animation if showHoverOverlay prop is true. */
  children: any;
  /** Enables slide up animation on hover if set to true */
  showHoverOverlay?: boolean;
  /** CSS Color or Theme Param */
  hoverColor?: string;
  [key: string]: any;
}
