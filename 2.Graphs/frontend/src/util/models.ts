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

export type Restaurants = {
  id: number;
  name: string;
};

export type Distances = {
  id: number;
  from: number;
  to: number;
  distance: number;
};
