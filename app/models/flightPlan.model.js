import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const FlightPlan = SequelizeInstance.define("flightplan", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  semestersFromGrad: {
    type: Sequelize.INTEGER,
  }
});

export default FlightPlan;
