import { DataTypes, Model } from "sequelize";

import sequelize from "../util/database";

export interface IUsers extends Model {
  id: number;
  names: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "user";
  tries: number;
  updatedAt: Date;
}

const Users = sequelize.define<IUsers>("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  names: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tries: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export default Users;
