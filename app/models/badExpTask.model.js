import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const BadExpTask = SequelizeInstance.define("badexptask", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: Sequelize.INTEGER
  }
});


// BADGEFULFILL
Badge.belongsToMany(Task, { throught: 'badexptask'});
Task.belongsToMany(Badge, { throught: 'badexptask'});


export default BadExpTask;
