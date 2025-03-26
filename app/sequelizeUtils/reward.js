import db from "../models/index.js";
const Reward = db.reward;
const Student = db.student;
import { Op } from "sequelize";
import FileHelpers from "../utilities/fileStorage.helper.js";

const exports = {};

exports.findAllRewards = async (
  page = 1,
  pageSize = 10,
  searchQuery = "",
  filters = {},
) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const whereCondition = {};

  if (searchQuery) {
    whereCondition.name = { [Op.like]: `%${searchQuery}%` };
  }

  if (filters.redemptionType) {
    whereCondition.redemptionType = {
      [Op.like]: `%${filters.redemptionType}%`,
    };
  }

  let order = [];

  if (filters.sortAttribute && filters.sortDirection) {
    // Default to ascending order if direction is not provided
    const direction =
      filters.sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    order = [[filters.sortAttribute, direction]];
  }

  const queryOptions = {
    offset,
    limit,
    where: whereCondition,
    order,
  };

  let rewards = await Reward.findAll(queryOptions);

  rewards = getFilesForRewards(rewards);

  const count = await Reward.count({
    where: whereCondition, // Apply the search condition to the count as well
  });

  const totalPages = Math.ceil(count / pageSize);

  return { rewards, count: totalPages };
};

exports.findAllRewardsForStudent = async (studentId) => {
  const response = await Reward.findAll({
    include: {
      model: Student,
      where: {
        id: studentId,
      },
      required: true,
    },
  });
  return getFilesForRewards(response);
};

exports.findOneReward = async (rewardId) => {
  const response = await Reward.findByPk(rewardId);
  return readFileForReward(response);
};

exports.findByPk = async (rewardId) => {
  return Reward.findByPk(rewardId);
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

const getFilesForRewards = (rewards) =>
  rewards.map((reward) => {
    return readFileForReward(reward);
  });

const readFileForReward = (reward) => {
  try {
    if (reward.imageName) {
      reward.dataValues.image = FileHelpers.read(reward.imageName);
    }
    return reward;
  } catch (err) {
    console.log(err);
    reward.dataValues.image = null;
    reward.dataValues.imageName = null;
    return reward;
  }
};

export default exports;
