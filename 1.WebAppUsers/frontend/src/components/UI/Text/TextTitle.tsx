import React from "react";
import styles from "./Text.module.css";

interface ITextTitle {
  title: string;
  children?: React.ReactNode;
}

export const TextTitle: React.FC<ITextTitle> = (props) => {
  return (
    <div className={styles.TextWrapper}>
      <div className={styles.TextTitle}>{props.title}</div>
      {props.children}
    </div>
  );
};
