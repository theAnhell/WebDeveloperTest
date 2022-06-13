'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class distance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  distance.init({
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    distance: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'distance',
  });
  return distance;
};