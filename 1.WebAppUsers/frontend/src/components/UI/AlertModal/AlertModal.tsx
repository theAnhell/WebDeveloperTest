import React from "react";
import styles from "./AlertModal.module.css";
import { Modal } from "../Modal/Modal";
import { clearState } from "../../../store/alertSlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";

interface IAlertModal {
  children: React.ReactNode;
}

export const AlertModal: React.FC<IAlertModal> = (props) => {
  const { error, message } = useAppSelector((state) => state.alert);
  const dispatch = useAppDispatch();

  let modal = null;
  if (error) {
    modal = (
      <Modal
        isError
        show={!!error}
        onHide={() => {
          dispatch(clearState());
        }}
      >
        {error}
      </Modal>
    );
  }
  if (message) {
    setTimeout(() => dispatch(clearState()), 3000);
    modal = (
      <div
        className={styles.Modal}
        style={{
          transform: message ? "translate(-50%, 2%)" : "translateY(-200vh)",
          opacity: message ? "1" : "0",
        }}
      >
        <div className={styles.Modal_content}> {message}</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {modal}
      {props.children}
    </React.Fragment>
  );
};
