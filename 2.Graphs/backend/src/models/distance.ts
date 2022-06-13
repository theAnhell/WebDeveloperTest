import { DataTypes, Model } from "sequelize";

import sequelize from "../util/database";

export interface IDistances extends Model {
  id: number;
  from: number;
  to: number;
  distance: number;
}

// I Decided to separate the tables so that the Restaurant tables doesn't get cluttered with this information

const Distances = sequelize.define<IDistances>("distance", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  from: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  to: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  distance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default Distances;
