import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const User = SequelizeInstance.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fName: {
    type: Sequelize.STRING,
  },
  lName: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
});

export default User;
