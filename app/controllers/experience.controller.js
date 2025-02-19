import Experience from "../sequelizeUtils/experience.js";

const exports = {};

exports.create = async (req, res) => {
  await Experience.createExperience(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the experience.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Experience.findOneExperience(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find experience with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving experience with id = " + req.params.id,
      });
      console.log("Could not find experience: " + err);
    });
};

exports.findAll = async (req, res) => {
  await Experience.findAllExperiences(
    req.query.page,
    req.query.pageSize,
    req.query.searchQuery,
  ).then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tasks.",
    });
  });
};

exports.update = async (req, res) => {
  await Experience.updateExperience(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Experience was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update experience with id = ${req.params.id}. Maybe experience was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating experience with id = " + req.params.id,
      });
      console.log("Could not update experience: " + err);
    });
};

exports.delete = async (req, res) => {
  await Experience.deleteExperience(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Experience was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete experience with id = ${req.params.id}. Maybe experience was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete experience with id = " + req.params.id,
      });
      console.log("Could not delete experience: " + err);
    });
};

export default exports;
