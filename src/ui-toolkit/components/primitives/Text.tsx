import React from "react";
import styled from "../../styled-components";
import { getThemeValue, getThemeColor } from "../PortalsThemeProvider/PortalsThemeProvider";

const CLASS_NAME = "put-text";

export interface TextProps {
  /** Allows CSS color values or theme parameters. */
  color?: string;
  /** The type of HTML Element. Defaults to div. */
  as?: string;
  /** Optional class name to use for styling. */
  className?: string;
  [key: string]: any;
}

export const Text: React.FC<TextProps> = ({
  children,
  className = "",
  as = "div",
  color = "bodyText",
  ...additionalProps
}) => {
  let cssClass = [CLASS_NAME, className].filter(Boolean).join(" ");
  return (
    <StyledText {...additionalProps} as={as} className={cssClass} color={color}>
      {children}
    </StyledText>
  );
};

export default Text;

const StyledText = styled.div`
  color: ${(props) => getThemeColor(props.color)};
  .ignore-variant & {
    color: ${(props) => getThemeColor(props.color, false)};
  }
`;
