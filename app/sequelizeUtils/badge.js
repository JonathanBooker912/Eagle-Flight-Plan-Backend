import db from "../models/index.js";
const Badge = db.badge;

const exports = {};

exports.findAllBadges = async (page = 1, pageSize = 10) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return await Badge.findAll({
    limit,
    offset,
  });
};

exports.findOneBadge = async (badgeId) => {
  return await Badge.findByPk(badgeId);
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

export default exports;
