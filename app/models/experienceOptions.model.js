import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const ExperienceOptions = SequelizeInstance.define("experienceoptions", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  }
});

export default ExperienceOptions;
