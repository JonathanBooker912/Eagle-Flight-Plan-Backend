import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const BadgeFulfill = SequelizeInstance.define("badgefulfill", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: Sequelize.DATE,
  }
});

export default BadgeFulfill;
