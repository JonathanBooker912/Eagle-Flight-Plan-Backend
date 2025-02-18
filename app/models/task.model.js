import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Task = SequelizeInstance.define("task", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category: {
    type: Sequelize.ENUM(
      "Academic",
      "Leadership",
      "Networking",
      "Strengths",
      "Career Prep",
      "Mentoring",
      "Volunteer",
    ),
  },
  taskType: {
    type: Sequelize.ENUM("Automatic", "Manual"),
  },
  reflectionRequired: {
    type: Sequelize.BOOLEAN,
  },
  schedulingType: {
    type: Sequelize.ENUM("one-time", "every semester", "special event"),
  },
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  rationale: {
    type: Sequelize.STRING,
  },
  semestersFromGraduation: {
    type: Sequelize.INTEGER,
  },
  completionType: {
    type: Sequelize.ENUM("automatic", "self-reported", "confirmed"),
  },
  pointsEarned: {
    type: Sequelize.INTEGER,
  },
});

export default Task;
