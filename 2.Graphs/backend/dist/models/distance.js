"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../util/database"));
// I Decided to separate the tables so that the Restaurant tables doesn't get cluttered with this information
const Distances = database_1.default.define("distance", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    from: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    to: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    distance: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
});
exports.default = Distances;
//# sourceMappingURL=distance.js.map