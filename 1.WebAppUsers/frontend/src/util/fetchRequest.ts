import { server } from "./axios";
import { Users } from "./models";

export const fetchUser = async (idUser: number) => {
  const response = await server.get<{ user: Users }>(
    `/dashboard/users/${idUser}`
  );
  return response.data.user;
};

export const fetchAllUsers = async () => {
  const response = await server.get<{ users: Users[] }>("/dashboard/users");
  return response.data.users;
};
