import db from "../models/index.js";
const Reward = db.reward;
const Student = db.student;
import { Op } from "sequelize";

const exports = {};

exports.findAllRewards = async (page = 1, pageSize = 10, searchQuery = "") => {
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

  const rewards = await Reward.findAll({
    offset,
    limit,
    where: whereCondition, // Apply the search condition
  });

  const count = await Reward.count({
    where: whereCondition, // Apply the search condition to the count as well
  });

  const totalPages = Math.ceil(count / pageSize);

  return { rewards, count: totalPages };
};

exports.findAllRewardsForStudent = async (studentId) => {
  return await Reward.findAll({
    include: {
      model: Student,
      where: {
        id: studentId,
      },
      required: true,
    },
  });
};

exports.findOneReward = async (rewardId) => {
  return await Reward.findByPk(rewardId);
};

exports.createReward = async (rewardData) => {
  return await Reward.create(rewardData);
};

exports.updateReward = async (rewardData, rewardId) => {
  return await Reward.update(rewardData, { where: { id: rewardId } });
};

exports.deleteReward = async (rewardId) => {
  return await Reward.destroy({ where: { id: rewardId } });
};

export default exports;
