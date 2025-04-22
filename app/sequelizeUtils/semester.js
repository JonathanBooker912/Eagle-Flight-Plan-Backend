import db from "../models/index.js";
import { Op } from "sequelize";

const Semester = db.semester;

const findAllSemesters = async () => {
  return await Semester.findAll({
    where: {
      endDate: {
        [Op.gt]: Date.now(),
      },
    },
  });
};

export default {
  findAllSemesters,
};
