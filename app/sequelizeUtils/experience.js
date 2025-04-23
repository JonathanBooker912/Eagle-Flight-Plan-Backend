import db from "../models/index.js";
import { Op } from "sequelize";
const Experience = db.experience;
const FlightPlanItem = db.flightPlanItem;
const FlightPlan = db.flightPlan;

const exports = {};

exports.findAllExperiences = async (
  page = null,
  pageSize = null,
  searchQuery = "",
) => {
  const whereCondition = searchQuery
    ? {
        name: {
          [Op.like]: `%${searchQuery}%`,
        },
      }
    : {};

  // If pagination parameters are not provided, return all records
  if (!page || !pageSize) {
    const experiences = await Experience.findAll({
      where: whereCondition,
    });
    return { experiences, count: experiences.length };
  }

  // Otherwise, use pagination
  const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
  const limit = parseInt(pageSize, 10);

  const experiences = await Experience.findAll({
    offset,
    limit,
    where: whereCondition,
  });

  const count = await Experience.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(count / parseInt(pageSize, 10));

  return { experiences, count: totalPages };
};

exports.findAllOptionalForFlightPlanId = async (
  studentId,
  searchQuery = "",
) => {
  const flightPlanItems = await FlightPlanItem.findAll({
    include: [
      {
        model: FlightPlan,
        as: "flightPlan",
        required: true,
        where: {
          studentId: studentId,
        },
      },
    ],
  });

  const experienceIds = flightPlanItems
    .map((item) => item.experienceId)
    .filter((id) => id !== null);

  const experiences = await Experience.findAll({
    where: {
      id: { [Op.notIn]: experienceIds },
      schedulingType: "optional",
      ...(searchQuery && { name: { [Op.like]: `%${searchQuery}%` } }),
    },
  });

  return experiences;
};

exports.findOneExperience = async (experienceId) => {
  return await Experience.findByPk(experienceId);
};

exports.createExperience = async (experienceData) => {
  return await Experience.create(experienceData);
};

exports.updateExperience = async (experienceData, experienceId) => {
  return await Experience.update(experienceData, {
    where: { id: experienceId },
  });
};

exports.deleteExperience = async (experienceId) => {
  return await Experience.destroy({ where: { id: experienceId } });
};

exports.getCategories = () => {
  return Experience.getAttributes().category.values;
};

// exports.getFulfillingEvents = () => {
//   return Experience.getAttributes().fulfillingEvent.values;
// };

exports.getExperienceTypes = () => {
  return Experience.getAttributes().experienceType.values;
};

exports.getSchedulingTypes = () => {
  return Experience.getAttributes().schedulingType.values;
};

export default exports;

// Non default exports

export const getAllExperiences = async () => {
  return await Experience.findAll();
};
