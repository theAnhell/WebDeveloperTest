import React from "react";
import { ConstantsColors } from "../../../../util/models";
import styles from "../Button.module.css";

interface ButtonProps {
  value: boolean | number | string;
  text: string;
}

interface ButtonGroupProps {
  actions: ButtonProps[];
  selected: boolean | number | string;
  setSelected: (value: boolean | number | string) => void;
  color?: ConstantsColors;
  title?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = (props) => {
  return (
    <div className={styles.ButtonGroupWrapper}>
      {props.title && (
        <label className={styles.Button_group_label}>{props.title}</label>
      )}
      <div className={styles.ButtonGroup}>
        {props.actions.map((act) => {
          const className = [styles.ButtonGroupButton];
          props.color && className.push(styles[`Button___${props.color}`]);

          if (props.selected === act.value) {
            className.push(styles.Button___active);
          } else {
            className.push(styles.Button___outline);
          }

          return (
            <button
              className={className.join(" ")}
              type="button"
              key={act.text}
              onClick={() => props.setSelected(act.value)}
            >
              {act.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};
