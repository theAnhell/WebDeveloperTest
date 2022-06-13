import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { server } from "../../util/axios";
import { fetchAllUsers, fetchUser } from "../../util/fetchRequest";
import { errorHandling, messageHandling } from "../../util/functions";
import { Users } from "../../util/models";
import { Modal } from "../UI/Modal/Modal";
import { Spinner } from "../UI/Spinner/Spinner";
import styles from "./Dashboard.module.css";
import { EditUser } from "./EditUser/EditUser";
import { SingleUser } from "./SingleUser/SingleUser";
import { ColumnsTable, Table } from "./Table/Table";

interface IDashboard {}

export const Dashboard: React.FC<IDashboard> = (props) => {
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const { role, id } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const {
    data: dbUsers,
    refetch: refetchUsers,
    isLoading,
  } = useQuery(["fetchUsers", role, id], async () => {
    if (role === "admin") {
      const users = await fetchAllUsers();
      return users;
    } else if (id) {
      const user = await fetchUser(id);
      return [user];
    }
  });

  const PatchUserMutation = useMutation(
    (params: {
      idUser: number;
      names: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      role: string;
      resetPassword: boolean;
    }) => server.patch(`/dashboard/users/${params.idUser}`, params),
    {
      onSuccess: (response) => {
        messageHandling(dispatch, response.data.message);
        setModalEdit(false);
        setModalDelete(false);
        setSelectedUser(null);
        refetchUsers();
      },
      onError: (err) => {
        errorHandling(dispatch, err);
        setModalEdit(false);
        setModalDelete(false);
        setSelectedUser(null);
      },
    }
  );

  const DeleteUserMutation = useMutation(
    (idUser: number) => server.delete(`/dashboard/users/${selectedUser?.id}`),
    {
      onSuccess: (response) => {
        messageHandling(dispatch, response.data.message);
        setModalEdit(false);
        setModalDelete(false);
        setSelectedUser(null);
        refetchUsers();
      },
      onError: (err) => {
        errorHandling(dispatch, err);
        setModalEdit(false);
        setModalDelete(false);
        setSelectedUser(null);
      },
    }
  );

  if (isLoading) return <Spinner />;

  if (role === "admin") {
    const users = dbUsers ?? [];

    const TableUserInformation = users.map((user) => ({
      Name: `${user.names} ${user.lastName}`,
      Email: user.email,
      Role: user.role,
      Actions: {
        editHandler: () => {
          setSelectedUser(user);
          setModalEdit(true);
          setModalDelete(false);
        },
        deleteHandler: () => {
          setSelectedUser(user);
          setModalDelete(true);
          setModalEdit(false);
        },
      },
    }));

    let columns: ColumnsTable[] = [];
    if (
      Array.isArray(TableUserInformation) &&
      TableUserInformation.length > 0
    ) {
      columns = Object.keys(TableUserInformation[0]).map((key) => ({
        Header: key,
        accessor: key,
      }));
    }
    return (
      <div>
        <Modal
          show={modalEdit}
          onHide={() => {
            setModalEdit(false);
            setSelectedUser(null);
          }}
          title="Edit user"
        >
          {selectedUser ? (
            <EditUser
              user={selectedUser}
              SubmitHandler={(values) =>
                PatchUserMutation.mutate({ idUser: selectedUser.id, ...values })
              }
            />
          ) : null}
        </Modal>
        {selectedUser ? (
          <Modal
            onHide={() => {
              setModalDelete(false);
              setSelectedUser(null);
            }}
            show={modalDelete}
            title="Delete User"
            actions={
              selectedUser.id === id
                ? undefined
                : [
                    {
                      color: "green",
                      text: "Delete User",
                      onClick: () => DeleteUserMutation.mutate(selectedUser.id),
                    },
                    { color: "red", text: "Cancel" },
                  ]
            }
          >
            {selectedUser.id === id
              ? "You can't delete your own user"
              : "Are you sure you want to delete this username?"}
          </Modal>
        ) : null}

        <Table data={TableUserInformation} columns={columns} />
      </div>
    );
  } else {
    const users = dbUsers ?? [];
    const selectedUser = users[0];
    return (
      <SingleUser
        user={selectedUser}
        SubmitHandler={(values) => PatchUserMutation.mutate(values)}
      />
    );
  }
};

export default Dashboard;
