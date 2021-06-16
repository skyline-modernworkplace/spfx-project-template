import React from "react";
import styled from "../../styled-components";
import Link from "./Link";
import { getThemeValue, getThemeColor } from "../PortalsThemeProvider/PortalsThemeProvider";
import Text from "./Text";

const CLASS_NAME = "title-ui-toolkit";

export interface TitleProps {
  /** If provided, the Title will be rendered as a link. */
  url?: string;
  /** The type of HTML Element. Defaults to h3. */
  as?: string;
  /** Allows CSS color values or theme parameters. */
  color?;
  /** Optional class name to use for styling. */
  className?: string;
  [key: string]: any;
}

export const Title: React.FC<TitleProps> = ({
  url = "",
  as = "h3",
  children,
  className = "",
  color = "bodyText",
  ...additionalProps
}) => {
  let cssClass = [CLASS_NAME, className].filter(Boolean).join(" ");

  return (
    <Link href={url} className={className} {...additionalProps}>
      <StyledTitle {...additionalProps} as={as} className={cssClass} color={color}>
        {children}
      </StyledTitle>
    </Link>
  );
};

export default Title;

const StyledTitle = styled(Text)`
  margin: 0;
  padding-bottom: 2px;
  a &:hover {
    opacity: 0.85;
  }
  color: ${(props) => getThemeColor(props.color)};
  .ignore-variant & {
    color: ${(props) => getThemeColor(props.color, false)};
  }
`;
