import { DataTypes, Model } from "sequelize";

import sequelize from "../util/database";

export interface IRestaurants extends Model {
  id: number;
  name: string;
}

const Restaurants = sequelize.define<IRestaurants>("restaurants", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Restaurants;
