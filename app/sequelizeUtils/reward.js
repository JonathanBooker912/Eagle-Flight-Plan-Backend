import db from "../models/index.js";
const Reward = db.reward;
const Student = db.student;

const exports = {};

exports.findAllRewards = async (page = 1, pageSize = 10) => {
  page = parseInt(page, 1);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  return await Reward.findAll({
    offset,
    limit,
  });
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
