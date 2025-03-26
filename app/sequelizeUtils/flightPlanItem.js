import db from "../models/index.js";
import { Op } from "sequelize";
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
  searchQuery = "",
  filters = {},
) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const whereCondition = {};

  whereCondition.flightPlanId = flightPlanId;

  if (searchQuery) {
    whereCondition.name = {
      [Op.like]: `%${searchQuery}%`, // Search in the title
    };
  }

  if (filters.status) {
    whereCondition.status = { [Op.eq]: filters.status };
  }

  if (filters.flightPlanItemType) {
    whereCondition.flightPlanItemType = { [Op.eq]: filters.flightPlanItemType };
  }

  let order = [];

  if (filters.sortAttribute && filters.sortDirection) {
    const direction =
      filters.sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    order = [[filters.sortAttribute, direction]];
  }

  const queryOptions = {
    offset,
    limit,
    where: whereCondition,
    order,
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
  };

  const response = await FlightPlanItem.findAll(queryOptions);

  const count = await FlightPlanItem.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(count / pageSize);

  return { count: totalPages, flightPlanItems: response };
};

exports.findOneFlightPlanItem = async (flightPlanItemId) => {
  return await FlightPlanItem.findByPk(flightPlanItemId);
};

exports.getFlightPlanItemTypes = () => {
  return FlightPlanItem.getAttributes().flightPlanItemType.values;
};

exports.getFlightPlanItemStatuses = () => {
  return FlightPlanItem.getAttributes().status.values;
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
