import db from "../models/index.js";
import { Op } from "sequelize";
const Event = db.event;
const Strength = db.strength;

const exports = {};

exports.findAllEvents = async (
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

  if (searchQuery) {
    whereCondition.name = { [Op.like]: `%${searchQuery}%` };
  }

  if (filters.startDate) {
    whereCondition.date = { [Op.gte]: new Date(filters.startDate) };
  }

  if (filters.endDate) {
    whereCondition.date = {
      ...whereCondition.date,
      [Op.lte]: new Date(filters.endDate),
    };
  }

  if (filters.location) {
    whereCondition.location = { [Op.like]: `%${filters.location}%` };
  }

  let order = [];

  if (filters.sortAttribute && filters.sortDirection) {
    // Default to ascending order if direction is not provided
    const direction =
      filters.sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    order = [[filters.sortAttribute, direction]];
  }

  const queryOptions = {
    offset,
    limit,
    where: whereCondition,
    include: [],
    order,
  };

  console.log(filters.strengths);

  if (filters.strengths && filters.strengths.length > 0) {
    queryOptions.include.push({
      model: Strength,
      where: { id: { [Op.in]: filters.strengths.map(Number) } },
      required: true, // Ensures only events with matching strengths are included
    });
  }

  const events = await Event.findAll(queryOptions);

  const count = await Event.count({
    where: whereCondition, // Apply the search condition to the count as well
  });

  const totalPages = Math.ceil(count / pageSize);

  return { events, count: totalPages };
};

exports.findOneEvent = async (eventId) => {
  return await Event.findByPk(eventId);
};

exports.createEvent = async (eventData) => {
  return await Event.create(eventData);
};

exports.updateEvent = async (eventData, eventId) => {
  return await Event.update(eventData, { where: { id: eventId } });
};

exports.deleteEvent = async (eventId) => {
  return await Event.destroy({ where: { id: eventId } });
};

exports.getRegistrationTypes = () => {
  return Event.getAttributes().registration.values;
};

exports.getAttendanceTypes = () => {
  return Event.getAttributes().attendanceType.values;
};

// exports.getEventTypes = () => {
//   return Event.getAttributes().attendanceType.values;
// };

exports.getCompletionTypes = () => {
  return Event.getAttributes().completionType.values;
};

export default exports;
