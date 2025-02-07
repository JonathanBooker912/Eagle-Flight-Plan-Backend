import Reward from "../sequelizeUtils/reward.js";

const exports = {};

exports.create = async (req, res) => {
  await Reward.createReward(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the reward.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Reward.findOneReward(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find reward with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving reward with id = " + req.params.id,
      });
      console.log("Could not find reward: " + err);
    });
};

exports.findAll = async (req, res) => {
  await Reward.findAllRewards()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving rewards.",
      });
    });
};

exports.findAllRewardsForStudent = async (req, res) => {
  await Reward.findAllRewardsForStudent()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving rewards.",
      });
    });
};

exports.update = async (req, res) => {
  await Reward.updateReward(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Reward was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update reward with id = ${req.params.id}. Maybe reward was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating reward with id = " + req.params.id,
      });
      console.log("Could not update reward: " + err);
    });
};

exports.delete = async (req, res) => {
  await Reward.deleteReward(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Reward was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete reward with id = ${req.params.id}. Maybe reward was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete reward with id = " + req.params.id,
      });
      console.log("Could not delete reward: " + err);
    });
};

export default exports;
