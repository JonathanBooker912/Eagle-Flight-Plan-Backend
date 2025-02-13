import FlightPlanItem from "../sequelizeUtils/flightPlanItem.js";

const exports = {};

exports.create = async (req, res) => {
  await FlightPlanItem.createFlightPlanItem(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the flightPlanItem.",
      });
    });
};

exports.findOne = async (req, res) => {
  await FlightPlanItem.findOneFlightPlanItem(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find flightPlanItem with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving flightPlanItem with id = " + req.params.id,
      });
      console.log("Could not find flightPlanItem: " + err);
    });
};

exports.findAll = async (req, res) => {
  await FlightPlanItem.findAllFlightPlanItems(req.query.page, req.query.pageSize)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving flightPlanItems.",
      });
    });
};

exports.findAllFlightPlanItemsByFlightPlanId = async (req, res) => {
  const flightPlanId = req.params.flightPlanId;
  const { page, pageSize } = req.query;

  await FlightPlanItem.findAllFlightPlanItemsByFlightPlanId(flightPlanId, page, pageSize)
    .then((data) => {
      if (data.length > 0) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No flightPlanItems found for flightPlanId = ${flightPlanId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving flightPlanItems for flightPlanId = " + flightPlanId,
      });
      console.log("Could not retrieve flightPlanItems: " + err);
    });
};

exports.update = async (req, res) => {
  await FlightPlanItem.updateFlightPlanItem(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "FlightPlanItem was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update flightPlanItem with id = ${req.params.id}. Maybe flightPlanItem was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating flightPlanItem with id = " + req.params.id,
      });
      console.log("Could not update flightPlanItem: " + err);
    });
};

exports.delete = async (req, res) => {
  await FlightPlanItem.deleteFlightPlanItem(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "FlightPlanItem was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete flightPlanItem with id = ${req.params.id}. Maybe flightPlanItem was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete flightPlanItem with id = " + req.params.id,
      });
      console.log("Could not delete flightPlanItem: " + err);
    });
};

export default exports;
