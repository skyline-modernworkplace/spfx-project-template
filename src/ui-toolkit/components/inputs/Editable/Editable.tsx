import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "ui-toolkit/styled-components";
import { IconButton } from "office-ui-fabric-react/lib/Button";

export function Editable({
  onChange,
  canEdit = true,
  value,
  contentType = "text",
  element = "div",
  className = "",
  placeholder = "Empty Value",
}: EditableProps) {
  let ref = useRef(null);
  let [mode, setMode] = useState(Modes.DISPLAY);

  let onSave = useCallback(() => {
    if (ref.current) {
      let updatedValue = contentType === "html" ? ref.current.innerHTML : ref.current.innerText;
      if (updatedValue !== value) onChange(updatedValue);
    }
    setMode(Modes.DISPLAY);
  }, [value, contentType, ref, onChange]) as any;

  const onCancel = useCallback(() => {
    if (ref.current) {
      if (contentType === "html") {
        ref.current.innerHTML = value;
      } else {
        ref.current.innerText = value;
      }
    }
    setMode(Modes.DISPLAY);
  }, [value, contentType, ref]);

  useEffect(() => {
    if (!canEdit) onCancel();
  }, [canEdit, onCancel]);

  let cssClass = [className, "editable", mode].join(" ");
  let isEditMode = mode === Modes.EDIT && canEdit;

  // If the user isn't allowed to edit and there is not a value
  if (!canEdit && !value) {
    return placeholder ? (
      <StyledEditable className={cssClass}>
        <p className="noValueText">{placeholder}</p>
      </StyledEditable>
    ) : null;
  }
  return (
    <StyledEditable className={cssClass}>
      <div className="buttons">
        {!isEditMode && canEdit && (
          <IconButton
            title="Edit"
            iconProps={{ iconName: "Edit" }}
            onClick={() => setMode(Modes.EDIT)}
          />
        )}
        {isEditMode && canEdit && (
          <>
            <IconButton title={"Cancel"} iconProps={{ iconName: "Cancel" }} onClick={onCancel} />
            <IconButton title="Save" iconProps={{ iconName: "Save" }} onClick={onSave} />
          </>
        )}
      </div>
      {React.createElement(element, {
        ref,
        className: "editable",
        contentEditable: mode === Modes.EDIT,
        dangerouslySetInnerHTML: {
          __html: getHtml(value, contentType, placeholder),
        },
      })}
    </StyledEditable>
  );
}

const getHtml = (value, contentType = "text", placeholder = "") => {
  if (!value) {
    return placeholder || "";
  }
  if (contentType === "text") {
    return value.replace(/\n/g, "<br />");
  }
  return value;
};

export interface EditableProps {
  /** The value, can be text or html string depending on contentType prop */
  value: string;
  /** Fires when they click the save icon. */
  onChange: (value: string) => void;
  /** The text to display when there is no value */
  placeholder?: string;
  /** Optional classname */
  className?: string;
  /** Defaults to 'text'. Helps you handle rich text scenarios.  */
  contentType?: "text" | "html";
  /** Allows you to control who can see the edit controls */
  canEdit?: boolean;
  /** Defaults to 'div'. What kind HTML element? */
  element?: "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4" | "li";
}

enum Modes {
  DISPLAY = "display",
  EDIT = "edit",
}

const StyledEditable = styled.div`
  position: relative;
  box-sizing: border-box;
  &.edit .editable {
    border: 1px dashed #d2d2d2;
    padding: 5px;
  }

  .buttons {
    position: absolute;
    left: -32px;
    top: -2px;
    display: flex;
    flex-direction: column;
    opacity: 0.6;
    &:hover {
      opacity: 1;
    }
    button.ms-Button {
      padding: 0;
    }
  }
  &.display {
    .buttons {
      opacity: 0;
    }
    &:hover {
      .buttons {
        opacity: 0.8;
      }
    }
  }
`;
