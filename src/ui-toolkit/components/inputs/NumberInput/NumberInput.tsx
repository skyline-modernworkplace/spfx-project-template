import React, { useEffect } from "react";
import styled from "ui-toolkit/styled-components";
import { useDebouncedEffect } from "ui-toolkit";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { TextField, ITextFieldProps } from "office-ui-fabric-react/lib/TextField";

export function NumberInput({
  value,
  onChange,
  step = 1,
  disabled,
  min,
  max,
  onChangeDelay = 300,
  ...rest
}: NumberInputProps) {
  const [inputStr, setInputStr] = React.useState(value + "");

  let inputNumber = parseFloat(inputStr);
  //   Current number will be 0 if current inputNumber is NaN to help with increment and decriment buttons when empty field or just "-"
  let currentNumber = isNaN(inputNumber) ? 0 : inputNumber;
  const incrementValue = () => {
    setInputStr(currentNumber + step + "");
  };
  const decrementValue = () => {
    setInputStr(currentNumber - step + "");
  };

  useDebouncedEffect(
    (debouncedValue) => {
      onChange(debouncedValue);
    },
    inputNumber,
    onChangeDelay
  );

  useEffect(() => {
    setInputStr(value + "");
  }, [value]);

  const UpDownButtons = () => {
    return (
      <div className="button-wrapper">
        <IconButton
          iconProps={{ iconName: "CalculatorSubtract" }}
          onClick={decrementValue}
          disabled={disabled}
        />
        <IconButton iconProps={{ iconName: "Add" }} onClick={incrementValue} disabled={disabled} />
      </div>
    );
  };

  const getErrorMessage = () => {
    if (min !== undefined && inputNumber < min) {
      return `Value must be greater than or equal to ${min}`;
    } else if (max !== undefined && inputNumber > max) {
      return `Value must be less than or equal to ${max}`;
    } else {
      return "";
    }
  };

  return (
    <StyledNumberInput>
      <TextField
        type="number"
        value={inputStr}
        onChange={(event, newValue) => setInputStr(newValue)}
        onRenderSuffix={() => UpDownButtons()}
        disabled={disabled}
        onGetErrorMessage={getErrorMessage}
        deferredValidationTime={400}
        step={step}
        {...rest}
      />
    </StyledNumberInput>
  );
}
export default NumberInput;

export interface FabricTextFieldProps extends ITextFieldProps {}

export interface NumberInputProps extends Omit<ITextFieldProps, "value" | "onChange"> {
  value: number;
  onChange: (newValue: number) => void;
  /**Number to increment/decrement by */
  step?: number;
  [key: string]: any;
  /** Delay in ms for onChange event to delay notifying parent when values have stopped changing */
  onChangeDelay?: number;
}

const StyledNumberInput = styled.div`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .button-wrapper {
    height: 100%;
    button {
      height: 100%;
    }
  }
`;
