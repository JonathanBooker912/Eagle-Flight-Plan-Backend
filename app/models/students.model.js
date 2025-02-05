import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Students = SequelizeInstance.define("students", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  graduationDate: {
    type: Sequelize.DATE,
  },
  pointsAwarded: {
    type: Sequelize.INTEGER,
  },
  pointsUsed: {
    type: Sequelize.INTEGER,
  }
});

export default Students;
