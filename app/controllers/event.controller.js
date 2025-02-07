import Event from "../sequelizeUtils/event.js";

const exports = {};

exports.create = async (req, res) => {
  await Event.createEvent(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the event.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Event.findOneEvent(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find event with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving event with id = " + req.params.id,
      });
      console.log("Could not find event: " + err);
    });
};

exports.findAll = async (req, res) => {
  await Event.findAllEvents()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};

exports.update = async (req, res) => {
  await Event.updateEvent(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Event was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update event with id = ${req.params.id}. Maybe event was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating event with id = " + req.params.id,
      });
      console.log("Could not update event: " + err);
    });
};

exports.delete = async (req, res) => {
  await Event.deleteEvent(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Event was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete event with id = ${req.params.id}. Maybe event was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete event with id = " + req.params.id,
      });
      console.log("Could not delete event: " + err);
    });
};

export default exports;
