import React from "react";
import styles from "./Actions.module.css";

interface ActionsProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Actions: React.FC<ActionsProps> = (props) => {
  return (
    <div className={styles.Actions} style={props.style}>
      {props.children}
    </div>
  );
};
