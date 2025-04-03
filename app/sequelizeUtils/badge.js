import db from "../models/index.js";
const Badge = db.badge;
const Student = db.student;
import { Op } from "sequelize";
import FileHelpers from "../utilities/fileStorage.helper.js";

const exports = {};

exports.findAllBadges = async (page = 1, pageSize = 10, searchQuery = "") => {
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

  let badges = await Badge.findAll({
    offset,
    limit,
    where: whereCondition, // Apply the search condition
  });

  badges = getFilesForBadges(badges);

  const count = await Badge.count({
    where: whereCondition, // Apply the search condition to the count as well
  });

  const totalPages = Math.ceil(count / pageSize);

  return { badges, count: totalPages };
};

exports.findAllBadgesForStudent = async (studentId) => {
  const response = await Badge.findAll({
    include: {
      model: Student,
      where: {
        id: studentId,
      },
      required: true,
    },
  });
  return getFilesForBadges(response);
};

exports.findOneBadge = async (badgeId) => {
  const response = await Badge.findByPk(badgeId);
  return readFileForBadge(response);
};

exports.findByPk = async (badgeId) => {
  return Badge.findByPk(badgeId);
};

exports.createBadge = async (badgeData) => {
  return await Badge.create(badgeData);
};

exports.updateBadge = async (badgeData, badgeId) => {
  return await Badge.update(badgeData, { where: { id: badgeId } });
};

exports.deleteBadge = async (badgeId) => {
  return await Badge.destroy({ where: { id: badgeId } });
};

const getFilesForBadges = (badges) =>
  badges.map((badge) => {
    return readFileForBadge(badge);
  });

const readFileForBadge = (badge) => {
  try {
    if (badge.imageName) {
      badge.dataValues.image = FileHelpers.read(badge.imageName, "photos");
    }
    return badge;
  } catch (err) {
    console.log(err);
    badge.dataValues.image = null;
    badge.dataValues.imageName = null;
    return badge;
  }
};

export default exports;
