import db from "../models/index.js";
import { Op } from "sequelize";
const Experience = db.experience;

const exports = {};

exports.findAllExperiences = async (page = 1, pageSize = 10, searchQuery = "") => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const whereCondition = searchQuery ? {
    name: {
      [Op.like]: `%${searchQuery}%`,
    },
  } : {};

  const experiences = await Experience.findAll({
    offset,
    limit,
    where: whereCondition,
  });

  const count = await Experience.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(count / pageSize);

  return {experiences, count: totalPages};
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

export default exports;
