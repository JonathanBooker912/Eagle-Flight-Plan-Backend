import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const StudentAward = SequelizeInstance.define("studentAward", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: Sequelize.DATE,
  },
  fulfillingUser: {
    type: Sequelize.INTEGER,
  },
  pointsDeducted: {
    type: Sequelize.INTEGER,
  },
});

export default StudentAward;
