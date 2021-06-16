import React from "react";

import { ColorPicker as FabricColorPicker } from "office-ui-fabric-react/lib/ColorPicker";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Callout, DirectionalHint } from "office-ui-fabric-react/lib/Callout";
import styled from "ui-toolkit/styled-components";
import { getThemeValue } from "../PortalsThemeProvider/PortalsThemeProvider";
export class ColorPicker extends React.PureComponent<ColorPickerProps, ColorPickerState> {
  elem: HTMLDivElement;
  state = {
    pickerVisible: false,
  };
  renderPicker = () => {
    if (!this.state.pickerVisible) return null;
    return (
      <Callout
        gapSpace={0}
        target={this.elem}
        setInitialFocus={true}
        directionalHint={DirectionalHint.topCenter}
        coverTarget={true}
        isBeakVisible={false}
        onDismiss={() => this.setState({ pickerVisible: false })}
      >
        <FabricColorPicker
          color={this.getColor()}
          onChange={(e, color) => this.props.onChange(color.str)}
        />
      </Callout>
    );
  };
  getColor = () => {
    return this.props.value;
  };
  openPicker = () => {
    this.setState({ pickerVisible: this.props.disabled ? false : true });
  };
  render() {
    let cssClass = ["colorPicker", this.props.className].filter((c) => c).join(" ");
    return (
      <StyledContainer ref={(el) => (this.elem = el)} className={cssClass}>
        {this.props.label && <div className={"label"}>{this.props.label}</div>}
        <div className={"inputGrouping"}>
          <TextField
            value={this.getColor()}
            onChange={(e, newValue) => this.props.onChange(newValue)}
            disabled={this.props.disabled}
          />
          <span
            className={"square"}
            style={{ background: getThemeValue("palette." + this.getColor(), this.getColor()) }}
            onClick={this.openPicker}
          />
        </div>
        {this.renderPicker()}
      </StyledContainer>
    );
  }
}

export default ColorPicker;

export interface ColorPickerState {
  pickerVisible: boolean;
}
export interface ColorPickerProps {
  /** Any valid CSS color (hex, rgb, etc...) */
  value: string;
  /** The function to call when the color changes */
  onChange: (newColor: string) => void;
  /** Defaults to none. Label for the input */
  label?: string;
  /** CSS class you can use for styling overrides */
  className?: string;
  /** Control whether the input is disabled. */
  disabled?: boolean;
}

const StyledContainer = styled.div`
  margin: 5px 0;
  .inputGrouping {
    position: relative;
  }
  .label {
    position: relative;
  }
  .square {
    position: absolute;
    right: 4px;
    top: 4px;
    width: 22px;
    height: 22px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: inline-block;
    cursor: pointer;
    transition: all 0.15s ease-out;
  }
  .square:hover {
    transform: scale(1.15, 1.15);
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.35);
  }
`;
