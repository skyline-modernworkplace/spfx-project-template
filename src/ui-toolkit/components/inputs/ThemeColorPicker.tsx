import React from "react";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import styled from "ui-toolkit/styled-components";
import { getThemeValue, getThemeColor } from "../PortalsThemeProvider/PortalsThemeProvider";

import ColorPicker from "./ColorPicker";
const options = [
  { key: "themePrimary", text: "Theme Primary" },
  { key: "themeSecondary", text: "Theme Secondary" },
  { key: "themeTertiary", text: "Theme Tertiary" },
  { key: "white", text: "White (Theme)" },
  // Allow injecting options here
  { key: "other", text: "Other" },
];

export const checkIsThemeColor = function (color: ThemeColor | string): boolean {
  if (!color) return false;
  let match = Object.keys(ThemeColor).find((key) => ThemeColor[key] === color);
  return !!match;
};

export class ThemeColorPicker extends React.PureComponent<ThemeColorPickerProps, {}> {
  static getHexColor = getThemeColor;
  static checkIsThemeColor = checkIsThemeColor;

  state = {
    dropdownValue: _getDropdownValue(this.props.value),
    otherColor: _getOtherColorValue(this.props.value),
  };
  onDropdownChange = (option) => {
    this.setState({ dropdownValue: option.key });

    let valueToSurface = option.key === "other" ? this.state.otherColor : option.key;

    this.props.onChange(valueToSurface);
  };
  onOtherColorChange = (color) => {
    this.setState({ otherColor: color });
    this.props.onChange(color);
  };
  render() {
    console.log("Extra Optinos", this.props);
    let extraOptions =
      this.props.extraOptions && this.props.extraOptions.length ? this.props.extraOptions : [];
    // TODO Add polyfill for reverse
    let [otherOption, ...firstOptions] = options.reverse();

    let allOptions = [...firstOptions.reverse(), ...extraOptions, otherOption];
    return (
      <StyledContainer>
        <Dropdown
          label={this.props.label}
          options={allOptions}
          selectedKey={this.state.dropdownValue}
          onChanged={this.onDropdownChange}
          disabled={this.props.disabled}
        />
        {this.state.dropdownValue === "other" && (
          <ColorPicker
            value={this.state.otherColor}
            onChange={this.onOtherColorChange}
            disabled={this.props.disabled}
          />
        )}
      </StyledContainer>
    );
  }
}

export default ThemeColorPicker;

export interface ThemeColorPickerProps {
  /** Any valid CSS color (hex, rgb, etc...) or a valid Theme Slot (themePrimary, bodySubtext, etc...) */
  value: string;
  /** The function to call when the color changes */
  onChange: (value: string) => void;
  /** Defaults to none. Label for the input */
  label?: string;
  /** Control whether the input is disabled. */
  disabled?: boolean;
  /** Add any extra pre-defined choices to the colors dropdown. Expects an array of { key, text }. */
  extraOptions?: { key: string; text: string }[];
}
const _getOtherColorValue = function (propValue = "primary") {
  // If the color string is passed in as the value, there will be no option matches
  // If a color string is passed in, use that to set state.otherColor otherwise use a pretty blue
  return options.map((o) => o.key).indexOf(propValue) === -1 ? propValue : "#2D5F9C";
};
const _getDropdownValue = function (propValue = "primary") {
  // check for an option match,
  //if 'other', the value will be like rgba(123,231,133,1) so there won't be a match
  return options.map((o) => o.key).indexOf(propValue) > -1 ? propValue : "other";
};

export enum ThemeColor {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
}

const StyledContainer = styled.div`
  position: relative;
  box-sizing: border-box;
`;
