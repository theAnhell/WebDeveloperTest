import React from "react";
import { IconContext, IconType } from "react-icons";
import { ConstantsColors } from "../../../util/models";
import styles from "./Button.module.css";

interface ButtonProps {
  active?: boolean;
  outline?: boolean;
  icon?: IconType;
  type?: "button" | "submit";
  color?: ConstantsColors;
  disabled?: boolean;
  inline?: boolean;
  onClick?: () => void;
  size?: number;
  clear?: boolean;
  isIcon?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const className = [styles.Button];
  props.color && className.push(styles[`Button___${props.color}`]);
  props.outline && className.push(styles.Button___outline);
  props.active && className.push(styles.Button___active);
  props.clear && className.push(styles.Button___clear);
  props.inline && className.push(styles.Button___inline);
  props.isIcon && className.push(styles.Button___isIcon);

  const Icon = props.icon;

  if (Icon) {
    const color = props.outline || props.isIcon ? props.color : "white";

    return (
      <IconContext.Provider
        value={{
          color: color || "black",
          style: { verticalAlign: "center" },
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (props.onClick) props.onClick();
          }}
          type={props.type}
          disabled={props.disabled}
          className={className.join(" ")}
        >
          <Icon size={props.size || 20} />
          {props.children}
        </button>
      </IconContext.Provider>
    );
  }

  return (
    <button
      className={className.join(" ")}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};
