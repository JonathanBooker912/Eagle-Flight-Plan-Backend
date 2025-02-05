import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const FlightPlanItem = SequelizeInstance.define("flightplanitem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: Sequelize.ENUM('Task', 'Experience'),
  },
  status: {
    type: Sequelize.ENUM('Complete', 'Incomplete', 'Pending'),
  },
  dueDate: {
    type: Sequelize.DATE,
  }
});

export default FlightPlanItem;
