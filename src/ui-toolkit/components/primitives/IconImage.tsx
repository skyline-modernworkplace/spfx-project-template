import React from "react";
import styled from "ui-toolkit/styled-components";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import BackgroundImage from "../primitives/BackgroundImage";
import { getThemeColor } from "../PortalsThemeProvider/PortalsThemeProvider";

const CLASS_NAME = "icon-image";

export const defaultIconImageProps: IconImageProps = {
  icon: "Photo2",
  width: 120,
  height: 120,
  backgroundColor: "themePrimary",
  iconColor: "#fff",
  circle: false,
  className: "",
};

export function IconImage(props: IconImageProps) {
  let fullProps = { ...defaultIconImageProps, ...props };

  let cssClass = [CLASS_NAME, fullProps.className, fullProps.circle ? "circle" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <StyledContainer {...fullProps} className={cssClass}>
      {checkIsIconName(fullProps.icon) ? (
        <Icon iconName={fullProps.icon} />
      ) : (
        <BackgroundImage src={fullProps.icon} />
      )}
    </StyledContainer>
  );
}

export default IconImage;

const wordRegex = /^\w+$/;
const checkIsIconName = function (icon: string): boolean {
  if (!icon) return false;
  return wordRegex.test(icon);
};

export const getIconFontSize = function (width, height, percentage = 50) {
  let smallerDimension = width < height ? width : height;
  return smallerDimension * (percentage / 100) + "px";
};

const StyledContainer = styled.div`
  position: relative;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background: ${(props) => getThemeColor(props.backgroundColor)};
  color: ${(props) => getThemeColor(props.iconColor)};
  font-size: ${(props) => getIconFontSize(props.width, props.height)};
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  a > &:hover {
    opacity: 0.85;
  }
  &.circle {
    border-radius: 50%;
  }
`;

export interface IconImageProps {
  /** A Fabric Icon name or an image url */
  icon: string;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Supports CSS color or a theme param */
  backgroundColor?: string;
  /** Supports CSS color or a theme param */
  iconColor?: string;
  /** Render as a circle */
  circle?: boolean;
  /** Class name to help with CSS overrides */
  className?: string;
}
