import Select from "@mui/material/Select";
import React from "react";
import { Control, Controller, DeepMap, FieldError } from "react-hook-form";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import styles from "./Select.module.css";

interface IMultipleSelect {
  title?: string;
  errors?: DeepMap<any, FieldError>;
  name?: string;
  control?: Control<any, object>;
  value?: unknown;
  onChange?: (value: unknown) => void;
  children?: React.ReactNode;
}

export const MultipleSelect: React.FC<IMultipleSelect> = (props) => {
  let MultipleSelectElement = null;
  if (props.name && props.control) {
    MultipleSelectElement = (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field }) => (
          <Select
            multiple
            value={field.value}
            onChange={(event) => field.onChange(event.target.value)}
          >
            {props.children}
          </Select>
        )}
      />
    );
  }
  if (props.onChange) {
    MultipleSelectElement = (
      <Select
        multiple
        value={props.value}
        onChange={(event) => {
          if (props.onChange) props.onChange(event.target.value);
        }}
      >
        {props.children}
      </Select>
    );
  }

  return (
    <div className={styles.SelectWrapper}>
      {props.title && (
        <label className={styles.Input_label}>{props.title}</label>
      )}
      {MultipleSelectElement}
      <ErrorMessage name={props.name} errors={props.errors} />
    </div>
  );
};
