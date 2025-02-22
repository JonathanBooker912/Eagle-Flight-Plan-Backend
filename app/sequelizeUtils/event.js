import db from "../models/index.js";
const Event = db.event;

const exports = {};

exports.findAllEvents = async (page = 1, pageSize = 10, searchQuery = "") => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const whereCondition = searchQuery
    ? {
        // Assuming you want to search by title or description (modify as needed
        name: {
          [Op.like]: `%${searchQuery}%`, // Search in the title
        },
      }
    : {};

  const events = await Event.findAll({
    offset,
    limit,
    where: whereCondition, // Apply the search condition
  });

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

export default exports;
