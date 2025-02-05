import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const EventType = SequelizeInstance.define("eventtype", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  eventType: {
    type: Sequelize.STRING,
  }
});

export default EventType;
