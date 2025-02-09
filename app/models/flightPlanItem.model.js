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
  eventId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'events',
      key: 'id',
    },
    allowNull: true, 
  },
  experienceId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'experiences', 
      key: 'id',
    },
    allowNull: true, 
  },
  taskId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'tasks', 
      key: 'id',
    },
    allowNull: true, 
  },
  flightPlanId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'flightPlans', 
      key: 'id',
    },
    allowNull: false, 
  },
}, {
  timestamps: true,
});

export default FlightPlanItem;