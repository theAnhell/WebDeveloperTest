import { Sequelize } from "sequelize";


// Normally I use .env to store this kind of data, but because is a test project I used the data directly in here.
export default new Sequelize("restaurantTest", "root", "", {
  dialect: "mysql",
  password: "123456",
  host: "127.0.0.1",
  logging: false, //! keep false
});
