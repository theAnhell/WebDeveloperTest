import React from "react";
import styles from "./Spinner.module.css";

export const Spinner: React.FC = () => {
  return (
    <div className={styles.skFoldingCube}>
      <div className={[styles.skCube1, styles.skCube].join(" ")}></div>
      <div className={[styles.skCube2, styles.skCube].join(" ")}></div>
      <div className={[styles.skCube4, styles.skCube].join(" ")}></div>
      <div className={[styles.skCube3, styles.skCube].join(" ")}></div>
    </div>
  );
};
