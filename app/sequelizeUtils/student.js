import db from "../models/index.js";
const Student = db.student;
const FlightPlan = db.flightPlan;
const FlightPlanItem = db.flightPlanItem;
const Task = db.task;
const Experience = db.experience;
const Event = db.event;

const exports = {};

exports.findStudentForUserId = async (userId) => {
  return await Student.findOne({ where: { userId } });
};

exports.getStudentWithFlightPlanInfo = async (studentId) => {
  const whereCondition = { id: studentId };
  const includes = [
    {
      model: FlightPlan,
      include: {
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
        subquery: false,
      },
    },
  ];

  return await Student.findAll({ where: whereCondition, includes: includes });
};

export default exports;
