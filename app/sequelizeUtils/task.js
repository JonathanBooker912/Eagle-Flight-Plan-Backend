import db from "../models/index.js";
const Task = db.task;
const Student = db.student;

const exports = {};

exports.findAllTasks = async (page = 1, pageSize = 10) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return await Event.findAll({
    limit,
    offset,
  });
};

exports.findAllTasksForStudent = async (studentId) => {
  return await Task.findAll({
    include: {
      model: Student,
      where: {
        id: studentId,
      },
      required: true,
    },
  });
};

exports.findOneTask = async (taskId) => {
  return await Task.findByPk(taskId);
};

exports.createTask = async (taskData) => {
  return await Task.create(taskData);
};

exports.updateTask = async (taskData, taskId) => {
  return await Task.update(taskData, { where: { id: taskId } });
};

exports.deleteTask = async (taskId) => {
  return await Task.destroy({ where: { id: taskId } });
};

export default exports;