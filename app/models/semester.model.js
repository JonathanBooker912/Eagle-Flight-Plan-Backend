import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Semester = SequelizeInstance.define("semester", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  term: {
    type: DataTypes.ENUM('fall', 'winter', 'spring', 'summer'),
    allowNull: false,
    defaultValue: 'spring'
  },
  year: {
    type: Sequelize.STRING(4),
  }
});

export default Semester;
