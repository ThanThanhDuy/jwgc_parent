import React from "react";
import { FormGroup, Label, Input, FormFeedback } from "reactstrap";
import "./index.scss";

function InputField(props) {
  const {
    label,
    id,
    placeholder,
    type,
    value,
    handleChange,
    // validate,
    hiddenLabel = false,
    height = 38,
    errors,
    maxLength,
  } = props;

  const handleBlur = (value) => {
    console.log(`${id}:`, value);
  };

  return (
    <FormGroup>
      {label && (
        <Label for={id} hidden={hiddenLabel}>
          {label}
        </Label>
      )}
      <Input
        style={{ height: `${height}px` }}
        id={id}
        name={id}
        placeholder={placeholder}
        type={type}
        onBlur={(e) => {
          const value = e.target.value;
          handleBlur(value);
        }}
        onChange={handleChange}
        value={value}
        invalid={errors ? true : false}
        maxLength={maxLength}
      />
      <FormFeedback>{errors}</FormFeedback>
    </FormGroup>
  );
}

export default InputField;
