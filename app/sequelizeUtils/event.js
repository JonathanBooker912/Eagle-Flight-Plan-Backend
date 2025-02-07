import db from "../models/index.js";
const Event = db.event;

const exports = {};

exports.findAllEvents = async () => {
  return await Event.findAll();
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
