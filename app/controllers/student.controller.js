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

export default exports;
