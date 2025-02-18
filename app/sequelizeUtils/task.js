import db from "../models/index.js";
import { Op } from "sequelize";
const Task = db.task;

const exports = {};

exports.findAllTasks = async (page = 1, pageSize = 10, searchQuery = "") => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const whereCondition = searchQuery
    ? {
        // Assuming you want to search by title or description (modify as needed
        name: {
          [Op.like]: `%${searchQuery}%`, // Search in the title
        },
      }
    : {};

  const tasks = await Task.findAll({
    offset,
    limit,
    where: whereCondition, // Apply the search condition
  });

  const count = await Task.count({
    where: whereCondition, // Apply the search condition to the count as well
  });

  const totalPages = Math.ceil(count / pageSize);

  return { tasks, count: totalPages };
};

exports.findOneTask = async (taskId) => {
  return await Task.findByPk(taskId);
};

exports.createTask = async (taskData) => {
  return await Task.create(taskData);
};

exports.updateTask = async (taskData, taskId) => {
  return await Task.update(taskData, {
    where: { id: taskId },
  });
};

exports.deleteTask = async (taskId) => {
  return await Task.destroy({ where: { id: taskId } });
};

export default exports;
