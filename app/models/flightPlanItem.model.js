import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const FlightPlanItem = SequelizeInstance.define("flightPlanItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  flightPlanType: {
    type: Sequelize.ENUM("Task", "Experience"),
  },
  status: {
    type: Sequelize.ENUM("Complete", "Incomplete", "Pending"),
  },
  dueDate: {
    type: Sequelize.DATE,
  },
}, {
  timestamps: true,
});

export default FlightPlanItem;