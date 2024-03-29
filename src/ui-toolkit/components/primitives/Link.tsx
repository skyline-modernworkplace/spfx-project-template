import React from "react";
import styled from "ui-toolkit/styled-components";
import { parse as parseUrl } from "url";
import PanelLink from "../Panel/PanelLink";
import { getThemeValue } from "../PortalsThemeProvider/PortalsThemeProvider";

const CLASS_NAME = "custom-link";
export interface LinkProps {
  href: string;
  target?: string;
  [key: string]: any;
}

export const Link: React.FC<LinkProps> = ({
  href = "",
  target = "",
  children,
  ...additionalProps
}) => {
  //Used by items like card title to render either a link or as just text
  if (!href) return <>{children}</>;

  if (target === "panel") {
    return (
      <PanelLink href={href} {...additionalProps}>
        {children}
      </PanelLink>
    );
  } else {
    return (
      <HyperLink href={href} target={target} {...additionalProps}>
        {children}
      </HyperLink>
    );
  }
};

export const HyperLink: React.FC<LinkProps> = ({
  href = "",
  target = "",
  className = "",
  dataInterception = "off",
  children,
  ...additionalProps
}) => {
  if (!href) return <>{children}</>;
  let computedTarget = calculateLinkTarget(href, target);
  let cssClass = [CLASS_NAME, className].filter(Boolean).join(" ");
  let props = {
    href,
    target: computedTarget,
    className: cssClass,
    "data-interception": dataInterception,
    ...additionalProps,
  };
  return <StyledLink {...props}>{children}</StyledLink>;
};

export default Link;

const StyledLink = styled.a`
  text-decoration: none;
  padding: 0;
  color: ${(props) => getThemeValue("semanticColors.link", "#0078d4")};
  &:hover {
    color: ${(props) => getThemeValue("semanticColors.linkHovered", "#005a9e")};
  }
  .ignore-variant & {
    color: ${(props) => getThemeValue("global.link", "#0078d4")};
    &:hover {
      color: ${(props) => getThemeValue("global.linkHovered", "#005a9e")};
    }
  }
`;

const calculateLinkTarget = function (url, target) {
  if (target || !url) return target;

  try {
    let currentHost = window.location.host;
    let targetUrl = parseUrl(url);
    return targetUrl.host && targetUrl.host.toLowerCase() !== currentHost.toLowerCase()
      ? "_blank"
      : "_self";
  } catch (err) {
    return "_self";
  }
};
