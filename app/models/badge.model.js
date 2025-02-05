import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Badge = SequelizeInstance.define("badge", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(255),
  },
  description: {
    type: Sequelize.STRING,
  },
  type: {
    //We don't have the enum defined
  },
  points: {
    type: Sequelize.INTEGER,
  },
  image: {
    type: Sequelize.BLOB
}
});

export default Badge;
