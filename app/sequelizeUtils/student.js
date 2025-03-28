import db from "../models/index.js";
const Student = db.student;

const exports = {};

exports.findStudentForUserId = async (userId) => {
  return await Student.findOne({ where: { userId } });
};

export default exports;
