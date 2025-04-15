import Badge from "../sequelizeUtils/badge.js";

const exports = {};

exports.create = async (req, res) => {
  await Badge.createBadge(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the badge.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Badge.findOneBadge(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find badge with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving badge with id = " + req.params.id,
      });
      console.log("Could not find badge: " + err);
    });
};

exports.getBadgesForStudent = async (req, res) => {
  const studentId = req.params.id; // Getting student ID from the URL parameter
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;

  try {
    const result = await Badge.findAllBadgesForStudent(
      studentId,
      page,
      pageSize,
    );

    if (result.badges.length > 0) {
      res.status(200).send(result);
    } else {
      res.status(200).send({
        badges: [],
        total: 0,
        count: 0,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving badges for student with id = " + studentId,
    });
    console.log("Error: ", err);
  }
};

exports.findAll = async (req, res) => {
  await Badge.findAllBadges(
    req.query.page,
    req.query.pageSize,
    req.query.searchQuery,
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving badges.",
      });
    });
};

exports.getRuleTypes = async (req, res) => {
  res.send(Badge.getRuleTypes());
};

exports.getUnviewedBadges = async (req, res) => {
  const studentId = req.params.id;

  try {
    const result = await Badge.getUnviewedBadges(studentId);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message:
        "Error retrieving unviewed badges for student with id = " + studentId,
    });
    console.log("Error: ", err);
  }
};

exports.viewBadge = async (req, res) => {
  const badgeId = req.params.id;
  await Badge.viewBadge(badgeId).then((data) => {
    res.send(data);
  });
};

exports.update = async (req, res) => {
  await Badge.updateBadge(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Badge was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update badge with id = ${req.params.id}. Maybe badge was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating badge with id = " + req.params.id,
      });
      console.log("Could not update badge: " + err);
    });
};

exports.delete = async (req, res) => {
  await Badge.deleteBadge(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Badge was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete badge with id = ${req.params.id}. Maybe badge was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete badge with id = " + req.params.id,
      });
      console.log("Could not delete badge: " + err);
    });
};

export default exports;
