export type ConstantsColors =
  | "primary"
  | "light_primary"
  | "dark_primary"
  | "shadow"
  | "secondary"
  | "success"
  | "green"
  | "warning"
  | "yellow"
  | "light"
  | "white"
  | "danger"
  | "red"
  | "dark"
  | "black";

export type Users = {
  id: number;
  names: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "user";
};
