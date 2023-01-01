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
    disabled,
    verify,
    isNeedVerify,
  } = props;

  const handleBlur = (value) => {
    // console.log(`${id}:`, value);
  };

  return (
    <FormGroup>
      {label && (
        <>
          <Label for={id} hidden={hiddenLabel}>
            {label}
          </Label>
          {isNeedVerify && (
            <>
              {id === "email" && verify && (
                <Label className="form__input__label__verify">
                  Email đã được xác thực
                </Label>
              )}
              {id === "email" && !verify && (
                <Label className="form__input__label__notVerify">
                  Email chưa được xác thực
                </Label>
              )}
              {id === "phone" && verify && (
                <Label className="form__input__label__verify">
                  Số điện thoại đã được xác thực
                </Label>
              )}
              {id === "phone" && !verify && (
                <Label className="form__input__label__notVerify">
                  Số điện thoại chưa được xác thực
                </Label>
              )}
            </>
          )}
        </>
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
        disabled={disabled}
      />
      <FormFeedback>{errors}</FormFeedback>
    </FormGroup>
  );
}

export default InputField;
