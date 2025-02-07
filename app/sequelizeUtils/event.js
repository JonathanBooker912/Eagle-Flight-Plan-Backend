import db from "../models/index.js";
const Event = db.event;

const exports = {};

exports.findAllEvents = async (page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  return await Event.findAll({
    limit,
    offset,
  });
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
