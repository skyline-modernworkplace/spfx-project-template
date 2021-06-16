import React from "react";
import { ThemeProvider } from "styled-components";
import { getValue } from "../../core/utils/utils";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

declare global {
  interface Window {
    _portalsTheme: any;
    __themeState__: any;
  }
}

export const PortalsThemeProvider: React.FC<PortalsThemeProviderProps> = ({ children, theme }) => {
  window._portalsTheme = {
    ...theme,
    global: (window as any).__themeState__.theme || {
      ...theme.semanticColors,
      ...theme.palette,
    },
    getValue: function (path: string, fallback = "#f00") {
      return getValue(this, path) || fallback;
    },
  };
  return <ThemeProvider theme={window._portalsTheme}>{children}</ThemeProvider>;
};

export interface PortalsThemeProviderProps {
  theme: IReadonlyTheme;
}

function getGlobalTheme() {
  return window.__themeState__ && window.__themeState__.theme ? window.__themeState__.theme : {};
}

export function getPortalsTheme() {
  let theme = window._portalsTheme;
  if (!theme) {
    theme = window._portalsTheme = {
      theme: getGlobalTheme(),
      global: {},
    };
  }
  return theme;
}

// getThemeColor("red") => "#f00"
// getThemeColor("bodyText") => theme.semanticColor.bodyText
// getThemeColor("themePrimary") => theme.palette.themePrimary
// getThemeColor("bodyText", false) => theme.global.bodyText

export function getThemeColor(color: string, obeyVariant = true) {
  if (color === "primary") {
    color = "themePrimary";
  }
  if (color === "secondary") {
    color = "themeSecondary";
  }
  if (color === "tertiary") {
    color = "themeTertiary";
  }
  if (!obeyVariant) {
    return getThemeColorByNamespace(color, null, "global") || color;
  }

  let semanticColor = getThemeColorByNamespace(color, null, "semanticColors");
  let paletteColor = getThemeColorByNamespace(color, null, "palette");
  return semanticColor || paletteColor || color;
}

function getThemeColorByNamespace(color: string, fallback: string, namespace: string) {
  return getThemeValue(`${namespace}.${color}`, fallback);
}

export function getThemeValue(path: string, fallback: string, theme?: any) {
  theme = theme || getPortalsTheme();
  return getValue(theme, path) || fallback;
}
