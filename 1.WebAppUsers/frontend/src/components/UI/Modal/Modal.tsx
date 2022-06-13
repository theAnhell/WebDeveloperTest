import React from "react";
import styles from "./Modal.module.css";
import { FaTimes } from "react-icons/fa";
import { Button } from "../Button/Button";
import { Text } from "../Text/Text";
import { Actions } from "../Actions/Actions";
import { ConstantsColors } from "../../../util/models";

type ActionButton = {
  color: ConstantsColors;
  onClick?: () => void;
  text: string;
};

interface ModalProps {
  show: boolean;
  onHide: () => void;
  title?: string;
  centered?: boolean;
  actions?: ActionButton[];
  children: React.ReactNode;
  isError?: boolean;
  fullSize?: boolean;
}

const ModalClass: React.FC<ModalProps> = (props) => {
  const classNames = [styles.Modal];
  props.fullSize && classNames.push(styles.Modal___fullsize);
  return (
    <React.Fragment>
      {props.show ? (
        <div className={styles.Backdrop} onClick={props.onHide}></div>
      ) : null}
      <div
        className={classNames.join(" ")}
        style={{
          transform: props.show
            ? "translate(-50%, -50%)"
            : "translateY(-200vh)",
          opacity: props.show ? "1" : "0",
        }}
      >
        <div
          className={[
            styles.Modal_header,
            props.isError ? styles.Modal_header___error : "",
          ].join(" ")}
        >
          {props.title ? (
            <Text title noPadding>
              {props.title}
            </Text>
          ) : (
            <div></div>
          )}
          <Button
            color={props.isError ? "white" : "black"}
            onClick={props.onHide}
            icon={FaTimes}
            size={20}
          />
        </div>

        <div
          className={[
            styles.Modal_content,
            props.centered ? styles.Modal_content___centered : "",
          ].join(" ")}
        >
          {props.children}
        </div>
        {props.actions ? (
          <div className={styles.Modal_footer}>
            <Actions>
              {props.actions.map((button, index) => (
                <Button
                  key={index}
                  type="button"
                  color={button.color}
                  onClick={() => {
                    if ("onClick" in button && button.onClick) {
                      button.onClick();
                    }
                    props.onHide();
                  }}
                >
                  {button.text}
                </Button>
              ))}
            </Actions>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export const Modal = React.memo(ModalClass, (prevProps, nextProps) => {
  return (
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children
  );
});
