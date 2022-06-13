import { useState } from "react";
import { FaPen } from "react-icons/fa";
import { useMutation } from "react-query";
import { useAppDispatch } from "../../../store/store";
import { server } from "../../../util/axios";
import { errorHandling, messageHandling } from "../../../util/functions";
import { Users } from "../../../util/models";
import { Actions } from "../../UI/Actions/Actions";
import { Button } from "../../UI/Button/Button";
import { Modal } from "../../UI/Modal/Modal";
import { TextTitle } from "../../UI/Text/TextTitle";
import { EditUser } from "../EditUser/EditUser";
import styles from "./SingleUser.module.css";

interface ISingleUser {
  user: Users;
  SubmitHandler: (values: {
    idUser: number;
    names: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    resetPassword: boolean;
  }) => void;
}

export const SingleUser: React.FC<ISingleUser> = (props) => {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();

  const completeName = `${props.user.names} ${props.user.lastName}`;
  return (
    <div className={styles.wrapper}>
      <Modal
        title="Edit User"
        onHide={() => setOpenModal(false)}
        show={openModal}
      >
        <EditUser
          user={props.user}
          SubmitHandler={(values) => {
            props.SubmitHandler({ idUser: props.user.id, ...values });
            setOpenModal(false);
          }}
        />
      </Modal>
      <h3 className={styles.title}>Welcome {completeName}!</h3>
      <div className={styles.card}>
        <TextTitle title="Name">{completeName}</TextTitle>
        <TextTitle title="Role">{props.user.role}</TextTitle>
        <TextTitle title="E-Mail">{props.user.email}</TextTitle>
        <Actions>
          <Button icon={FaPen} inline onClick={() => setOpenModal(true)}>
            Edit User
          </Button>
        </Actions>
      </div>
    </div>
  );
};
