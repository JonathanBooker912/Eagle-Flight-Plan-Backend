import db from "../models/index.js";
const Link = db.link;

const exports = {};


exports.findAllLinksById = async (
    
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