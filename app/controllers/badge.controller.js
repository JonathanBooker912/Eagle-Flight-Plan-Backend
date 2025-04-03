import Badge from "../sequelizeUtils/badge.js";
import Student from "../models/student.model.js";
import BadgeModel from "../models/badge.model.js";

import FileHelpers from "../utilities/fileStorage.helper.js";

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

  try {
    const studentWithBadges = await Student.findOne({
      where: { id: studentId }, // Find student by their ID
      include: [
        {
          model: BadgeModel, // Include the BadgeModel
          through: { attributes: [] }, // Don't include extra fields from the join table
        },
      ],
    });

    if (studentWithBadges) {
      res.status(200).send(studentWithBadges);
    } else {
      res.status(404).send({
        message: `No badges found for student with id = ${studentId}.`,
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

exports.uploadImage = async (req, res) => {
  try {
    await FileHelpers.upload(req, res);
    res.status(200).send({ fileName: req.savedFileName });
  } catch (err) {
    res.status(400).send({ message: "Failed to upload image" });
  }
};

exports.getImageForName = async (req, res) => {
  try {
    const response = await FileHelpers.read(req.params.fileName);
    res.status(200).send({ image: response });
  } catch (err) {
    res.status(404).send({ message: "Couldn't find image" });
  }
};

exports.deleteBadgeImage = async (req, res) => {
  try {
    await FileHelpers.remove(req.params.fileName);
    res.status(200).send({
      message: `Successfully deleted image with name: ${req.params.fileName}`,
    });
  } catch (err) {
    res.status(400).send({
      message: `There was an error deleting image with name: ${req.params.fileName}`,
    });
  }
};

export default exports;
