import Submission from "../sequelizeUtils/submission.js";

const exports = {};

exports.create = async (req, res) => {
  await Submission.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the submission.",
      });
    });
};

export default exports;
