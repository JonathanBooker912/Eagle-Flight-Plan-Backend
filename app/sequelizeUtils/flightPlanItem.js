import db from "../models/index.js";
const FlightPlanItem = db.flightPlanItem;
const Task = db.task;
const Experience = db.experience;
const Event = db.event;
const exports = {};

exports.findAllFlightPlanItems = async (page = 1, pageSize = 10) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return await FlightPlanItem.findAll({
    limit,
    offset,
  });
};

exports.findAllFlightPlanItemsByFlightPlanId = async (
  flightPlanId,
  page = 1,
  pageSize = 10,
) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const response = await FlightPlanItem.findAll({
    where: { flightPlanId },
    limit,
    offset,
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
          "pointsEarned",
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
  });

  const count = await FlightPlanItem.count({
    where: { flightPlanId },
  });

  const totalPages = Math.ceil(count / pageSize);

  return { count: totalPages, flightPlanItems: response };
};

exports.getFlightPlanProgress = async (flightPlanId) => {
  const response = await FlightPlanItem.findAll({ where: { flightPlanId } });
  let completed = response.reduce((previous, current) => {
    return previous + (current.status == "Complete" ? 1 : 0);
  }, 0);

  const progress =
    response.length > 0 ? Math.round(100 * (completed / response.length)) : 0; // Prevent division by zero

  return { progress };
};

exports.findOneFlightPlanItem = async (flightPlanItemId) => {
  return await FlightPlanItem.findByPk(flightPlanItemId);
};

exports.createFlightPlanItem = async (flightPlanItemData) => {
  return await FlightPlanItem.create(flightPlanItemData);
};

exports.updateFlightPlanItem = async (flightPlanItemData, flightPlanItemId) => {
  return await FlightPlanItem.update(flightPlanItemData, {
    where: { id: flightPlanItemId },
  });
};

exports.deleteFlightPlanItem = async (flightPlanItemId) => {
  return await FlightPlanItem.destroy({ where: { id: flightPlanItemId } });
};

export default exports;
