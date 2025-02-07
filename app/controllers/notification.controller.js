import Notification from "../sequelizeUtils/notification.js";

const exports = {};

exports.create = async (req, res) => {
  await Notification.createNotification(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the notification.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Notification.findOneNotification(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find notification with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving notification with id = " + req.params.id,
      });
      console.log("Could not find notification: " + err);
    });
};

exports.findAll = async (req, res) => {
  await Notification.findAllNotifications(req.query.page, req.query.pageSize)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving notifications.",
      });
    });
};

exports.findAllNotificationsForUser = async (req, res) => {
  await Notification.findAllNotificationsForUser(
    req.params.id,
    req.query.page,
    req.query.pageSize,
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving notifications.",
      });
    });
};

exports.update = async (req, res) => {
  await Notification.updateNotification(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Notification was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update notification with id = ${req.params.id}. Maybe notification was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating notification with id = " + req.params.id,
      });
      console.log("Could not update notification: " + err);
    });
};

exports.delete = async (req, res) => {
  await Notification.deleteNotification(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Notification was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete notification with id = ${req.params.id}. Maybe notification was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete notification with id = " + req.params.id,
      });
      console.log("Could not delete notification: " + err);
    });
};

export default exports;
