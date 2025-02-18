import db from "../models/index.js";
const FlightPlanItem = db.flightPlanItem;

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

  return await FlightPlanItem.findAll({
    where: { flightPlanId },
    limit,
    offset,
  });
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
