import Link from "../sequelizeUtils/link.js";

const exports = {};

exports.findAllLinksForStudent = async (req, res) => {
    await Link.findAllLinksForStudent(
        req.params.id
    )    .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving links.",
        });
      });
};