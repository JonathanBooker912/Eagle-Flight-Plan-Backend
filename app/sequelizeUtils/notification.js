import db from "../models/index.js";
const Notification = db.notification;
const User = db.user;

const exports = {};

exports.findAllNotifications = async (page = 1, pageSize = 10) => {
  page = parseInt(page);
  pageSize = parseInt(pageSize);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return await Notification.findAll({
    limit,
    offset,
  });
};

exports.findAllNotificationsForUser = async (
  userId,
  page = 1,
  pageSize = 10,
) => {
  page = parseInt(page);
  pageSize = parseInt(pageSize);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return await Notification.findAll({
    attributes: ["header", "description", "actionLink", "read", "id"],
    include: {
      model: User,
      as: "user",
      where: {
        id: userId,
      },
      required: true,
    },
    limit,
    offset,
  });
};

exports.findOneNotification = async (notificationId) => {
  return await Notification.findByPk(notificationId);
};

exports.createNotification = async (notificationData) => {
  return await Notification.create(notificationData);
};

exports.updateNotification = async (notificationData, notificationId) => {
  return await Notification.update(notificationData, {
    where: { id: notificationId },
  });
};

exports.deleteNotification = async (notificationId) => {
  return await Notification.destroy({ where: { id: notificationId } });
};

export default exports;
