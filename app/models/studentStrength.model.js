import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const StudentStrength = SequelizeInstance.define("studentstrength", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

export default StudentStrength;
