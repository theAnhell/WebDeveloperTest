import React from "react";
import { DeepMap, FieldError, UseFormRegister } from "react-hook-form";
import styles from "./Select.module.css";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";

export type Options = {
  value: number | string;
  text: string;
};

interface SelectProps {
  options: Options[];
  title?: string;
  defaultValue?: string;
  value?: string | number | readonly string[];
  disabled?: boolean;
  errors?: DeepMap<any, FieldError>;
  name?: string;
  register?: UseFormRegister<any>;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export const Select: React.FC<SelectProps> = (props) => {
  if (props.options.length === 0) {
    return (
      <div className={styles.SelectWrapper}>
        {props.title && (
          <label className={styles.Input_label}>{props.title}</label>
        )}
        <select className={styles.Select} disabled></select>

        <ErrorMessage>{props.defaultValue}</ErrorMessage>
      </div>
    );
  }

  let SelectElement = null;

  const ContentOfSelectElement = (
    <>
      {props.defaultValue ? (
        <option hidden value="">
          {props.defaultValue}
        </option>
      ) : null}
      {props.options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.text}
        </option>
      ))}
    </>
  );

  if (props.name && props.register) {
    SelectElement = (
      <select
        className={styles.Select}
        {...props.register(props.name)}
        disabled={props.disabled}
      >
        {ContentOfSelectElement}
      </select>
    );
  }

  if (props.onChange) {
    SelectElement = (
      <select
        className={styles.Select}
        value={props.value}
        disabled={props.disabled}
        onChange={props.onChange}
      >
        {ContentOfSelectElement}
      </select>
    );
  }

  return (
    <div className={styles.SelectWrapper}>
      {props.title && (
        <label className={styles.Input_label}>{props.title}</label>
      )}
      {SelectElement}

      <ErrorMessage name={props.name} errors={props.errors} />
    </div>
  );
};
