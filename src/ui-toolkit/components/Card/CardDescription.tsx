import React from "react";
import styled from "ui-toolkit/styled-components";
import Shave from "../Shave/Shave";
import { getThemeValue } from "../PortalsThemeProvider/PortalsThemeProvider";
import useShave from "ui-toolkit/hooks/useShave";

const CLASS_NAME = "card-description";
export default function CardDescription({ children, className = "", as = "p", shave = 0 }) {
  let cssClass = [CLASS_NAME, className].filter(Boolean).join(" ");
  let [shaveProps] = useShave(shave);
  return (
    <StyledDescription className={cssClass} as={as} {...shaveProps}>
      {children}
    </StyledDescription>
  );
}

const StyledDescription = styled.p`
  /* font-weight: 200; */
  padding: 10px 0;
  color: ${(props) => getThemeValue("semanticColors.bodyText", "#333")};
  .ignore-variant & {
    color: ${(props) => getThemeValue("global.bodyText", "#333")};
  }
`;
