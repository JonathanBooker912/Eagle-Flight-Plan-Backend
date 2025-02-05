import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Reward = SequelizeInstance.define("reward", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(255),
  },
  description: {
    type: Sequelize.STRING(255),
  },
  points: {
    type: Sequelize.INTEGER,
  },
  redemptionType: {
    //ENUM NOT DEFINED
  },
  redemptionInfo: {
    type: Sequelize.STRING(255),
  },
  image: {
    type: Sequelize.BLOB,
  }
});

export default Reward;
