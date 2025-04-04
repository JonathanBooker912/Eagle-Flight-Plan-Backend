import db from "../models/index.js";
const Student = db.student;
const FlightPlan = db.flightPlan;
const FlightPlanItem = db.flightPlanItem;
const Task = db.task;
const Experience = db.experience;
const Event = db.event;
const Semester = db.semester;
const Op = db.Sequelize.Op;
const User = db.user;

const exports = {};

exports.findStudentForUserId = async (userId) => {
  return await Student.findOne({ where: { userId } });
};

exports.getStudentWithFlightPlanInfo = async (studentId) => {
  const whereCondition = { id: studentId };
  const includes = [
    {
      model: FlightPlan,
      include: [
        {
          model: FlightPlanItem,
          include: [
            {
              model: Task,
              as: "task",
            },
            {
              model: Experience,
              as: "experience",
            },
            {
              model: Event,
              as: "event",
            },
          ],
          order: [["semestersFromGrad", "ASC"]],
        },
        {
          model: Semester,
          as: "semester",
        },
      ],
    },
  ];

  return await Student.findOne({ where: whereCondition, include: includes });
};

exports.create = async (studentData) => {
  studentData.fullName = studentData.fName + " " + studentData.lName;
  return await Student.create(studentData);
};

exports.findAll = async ({
  id,
  email,
  filter,
  offset = 0,
  limit = 10000000,
}) => {
  let condition = null;

  if (filter) {
    condition = {
      [Op.or]: [
        { "$user.fName$": { [Op.like]: `%${filter}%` } },
        { "$user.lName$": { [Op.like]: `%${filter}%` } },
        { "$user.fullName$": { [Op.like]: `%${filter}%` } },
        { "$user.email$": { [Op.like]: `%${filter}%` } },
      ],
    };
  } else if (id) {
    condition = {
      [Op.or]: [{ "$user.id$": { [Op.like]: `%${id}%` } }],
    };
  } else if (email) {
    condition = {
      [Op.or]: [{ "$user.email$": { [Op.like]: `%${email}%` } }],
    };
  }

  return await Student.findAndCountAll({
    where: {}, // No conditions on Student
    offset,
    limit,
    include: [{ model: User, as: "user", required: true, where: condition }],
  });
};

exports.findById = async (id) => {
  return await Student.findByPk(id, {
    include: [{ model: User, as: "user" }],
  });
};

exports.update = async (id, updateData) => {
  return await Student.update(updateData, { where: { id } });
};

exports.delete = async (id) => {
  return await Student.destroy({ where: { id } });
};

export default exports;
