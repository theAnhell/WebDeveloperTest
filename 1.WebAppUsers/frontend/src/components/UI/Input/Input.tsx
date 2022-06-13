import React from "react";
import styles from "./Input.module.css";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { DeepMap, FieldError, UseFormRegister } from "react-hook-form";

interface InputProps {
  title?: string;
  type?: string;
  disabled?: boolean;
  inline?: boolean;
  placeholder?: string;
  errors?: DeepMap<any, FieldError>;
  readOnly?: boolean;
  defaultValue?: string | null;
  pattern?: string;
  value?: string | number | readonly string[];
  name?: string;
  register?: UseFormRegister<any>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Input: React.FC<InputProps> = (props) => {
  let InputElement = null;

  if (props.name && props.register) {
    InputElement = (
      <input
        className={styles.Input}
        disabled={props.disabled}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue || ""}
        type={props.type}
        pattern={props.pattern}
        readOnly={props.readOnly}
        {...props.register(props.name)}
      />
    );
  }
  if (props.onChange) {
    InputElement = (
      <input
        className={styles.Input}
        disabled={props.disabled}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue || ""}
        type={props.type}
        pattern={props.pattern}
        readOnly={props.readOnly}
        value={props.value}
        onChange={props.onChange}
      />
    );
  }

  return (
    <div>
      <div className={props.inline ? styles.Input___inline : ""}>
        {props.title && (
          <label className={styles.Input_label}>{props.title}</label>
        )}
        {InputElement}
        <ErrorMessage name={props.name} errors={props.errors} />
      </div>
    </div>
  );
};
