import db from "../models/index.js";
import { Op } from "sequelize";
const Semester = db.semester;

const exports = {};

exports.getCurrentSemester = async () => {
  return await Semester.findOne({
    where: {
      startDate: { [Op.lte]: new Date() }, // startDate <= current date
      endDate: { [Op.gte]: new Date() }, // endDate >= current date
    },
  });
};

export default exports;
