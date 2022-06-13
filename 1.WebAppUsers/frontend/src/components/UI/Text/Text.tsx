import React from "react";
import styles from "./Text.module.css";

interface TextProps {
  inline?: boolean;
  noPadding?: boolean;
  title?: boolean;
  center?: boolean;
  children?: React.ReactNode;
}

export const Text: React.FC<TextProps> = (props) => {
  const className = [styles.Text];
  props.inline && className.push(styles.Text___inline);
  props.title && className.push(styles.Text___title);
  props.noPadding && className.push(styles.Text___noPadding);
  props.center && className.push(styles.Text___center);
  return <div className={className.join(" ")}>{props.children}</div>;
};
