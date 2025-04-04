import Student from "../sequelizeUtils/student.js";

const exports = {};

exports.findStudentForUserId = async (req, res) => {
  await Student.findStudentForUserId(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving strengths.",
      });
    });
};

exports.create = async (req, res) => {
  // Validate required fields in the request body
  if (
    req.body.graduationDate == null ||
    req.body.pointsAwarded == null ||
    req.body.pointsUsed == null
  ) {
    return res.status(400).send({
      message:
        "Graduation date, points awarded, and points used cannot be empty!",
    });
  }

  const studentData = {
    graduationDate: req.body.graduationDate,
    pointsAwarded: req.body.pointsAwarded,
    pointsUsed: req.body.pointsUsed,
  };

  await Student.create(studentData)
    .then((data) => res.status(201).send(data))
    .catch((err) =>
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the student.",
      }),
    );
};

// Retrieve all Students
exports.findAll = async (req, res) => {
  await Student.findAll(req.query)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving students.",
      }),
    );
};

// Retrieve a single Student with id
exports.findOne = async (req, res) => {
  await Student.findById(req.params.id)
    .then((data) => {
      if (data) res.send(data);
      else
        res
          .status(404)
          .send({ message: `Student with id=${req.params.id} not found.` });
    })
    .catch(() =>
      res
        .status(500)
        .send({ message: `Error retrieving Student with id=${req.params.id}` }),
    );
};

// Update a Student with id
exports.update = async (req, res) => {
  await Student.update(req.params.id, req.body)
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Student updated successfully." });
      } else {
        res.send({
          message: `Student with id=${req.params.id} not found or no updates provided.`,
        });
      }
    })
    .catch(() =>
      res
        .status(500)
        .send({ message: `Error updating Student with id=${req.params.id}` }),
    );
};

// Delete a Student with id
exports.delete = async (req, res) => {
  await Student.delete(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Student deleted successfully!" });
      } else {
        res.send({ message: `Student with id=${req.params.id} not found.` });
      }
    })
    .catch(() =>
      res
        .status(500)
        .send({ message: `Error deleting Student with id=${req.params.id}` }),
    );
};

exports.findStudentForFlightPlanId = async (req, res) => {
  await Student.findStudentForFlightPlanId(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving student for flight plan id.",
      });
    });
};

exports.updatePoints = async (req, res) => {
  await Student.updatePoints(req.params.id, req.body.points)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while updating points.",
      });
    });
};

export default exports;
