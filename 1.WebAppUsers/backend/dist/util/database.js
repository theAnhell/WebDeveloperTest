"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Normally I use .env to store this kind of data, but because is a test project I used the data directly in here.
exports.default = new sequelize_1.Sequelize("userTest", "root", "", {
    dialect: "mysql",
    password: "123456",
    host: "127.0.0.1",
    logging: false, //! keep false
});
//# sourceMappingURL=database.js.map