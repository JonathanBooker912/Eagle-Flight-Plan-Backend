import db from "../models/index.js";
const FlightPlan = db.flightPlan;
const FlightPlanItem = db.flightPlanItem;
const Task = db.task;
const Experience = db.experience;
const Event = db.event;
const exports = {};

exports.findAllFlightPlans = async (page = 1, pageSize = 10) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return await FlightPlan.findAll({
    limit,
    offset,
  });
};

exports.findFlightPlanForStudent = async (studentId) => {
  return await FlightPlan.findAll({
    include: [
      {
        model: FlightPlanItem,
        attributes: ["flightPlanItemType", "status", "id"],
        include: [
          {
            model: Task,
            as: "task",
            attributes: [
              "id",
              "category",
              "taskType",
              "reflectionRequired",
              "schedulingType",
              "name",
              "description",
              "rationale",
              "semestersFromGraduation",
              "completionType",
              "points",
            ],
          },
          {
            model: Experience,
            as: "experience",
            attributes: [
              "id",
              "category",
              "experienceType",
              "reflectionRequired",
              "schedulingType",
              "description",
              "name",
              "rationale",
              "points",
            ],
          },
          {
            model: Event,
            as: "event",
          },
        ],
      },
    ],
  });
};

exports.findOneFlightPlan = async (flightPlanId) => {
  return await FlightPlan.findByPk(flightPlanId);
};

exports.createFlightPlan = async (flightPlanData) => {
  return await FlightPlan.create(flightPlanData);
};

exports.updateFlightPlan = async (flightPlanData, flightPlanId) => {
  return await FlightPlan.update(flightPlanData, {
    where: { id: flightPlanId },
  });
};

exports.deleteFlightPlan = async (flightPlanId) => {
  return await FlightPlan.destroy({ where: { id: flightPlanId } });
};

export default exports;
