import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Notifications = SequelizeInstance.define("notifications", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  header: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
   actionLink: {
    type: Sequelize.STRING,
  },
});

export default notifications;
