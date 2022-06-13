import React from "react";
import styles from "./ErrorMessage.module.css";
import { ErrorMessage as HFErrorMessage } from "@hookform/error-message";
import { DeepMap } from "react-hook-form";
import { FieldError } from "react-hook-form";

interface ErrorMessageProps {
  name?: string;
  errors?: DeepMap<any, FieldError>;
  children?: React.ReactNode;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
  if ("name" in props && props.name && props.errors) {
    return (
      <HFErrorMessage
        errors={props.errors}
        name={props.name}
        render={({ message }) => (
          <div className={styles.ErrorMessage}>{message}</div>
        )}
      />
    );
  }
  return <div className={styles.ErrorMessage}>{props.children}</div>;
};
