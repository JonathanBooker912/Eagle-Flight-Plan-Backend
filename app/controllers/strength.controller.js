import Strength from "../sequelizeUtils/strength.js";

const exports = {};

exports.findAll = async (req, res) => {
  await Strength.findAllStrengths()
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
