import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const StudentBadge = SequelizeInstance.define("studentbadge", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  dateAwarded: {
    type: Sequelize.DATE,
  }
});

export default StudentBadge;
