import task from "../sequelizeUtils/task.js";

const exports = {};

exports.create = async (req, res) => {
  await task.createtask(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the task.",
      });
    });
};

exports.findOne = async (req, res) => {
  await task.findOnetask(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find task with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving task with id = " + req.params.id,
      });
      console.log("Could not find task: " + err);
    });
};

exports.findAll = async (req, res) => {
  await task.findAlltasks()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tasks.",
      });
    });
};

exports.findAlltasksForStudent = async (req, res) => {
  await task.findAlltasksForStudent()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tasks.",
      });
    });
};

exports.update = async (req, res) => {
  await task.updatetask(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "task was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update task with id = ${req.params.id}. Maybe task was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating task with id = " + req.params.id,
      });
      console.log("Could not update task: " + err);
    });
};

exports.delete = async (req, res) => {
  await task.deletetask(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "task was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete task with id = ${req.params.id}. Maybe task was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete task with id = " + req.params.id,
      });
      console.log("Could not delete task: " + err);
    });
};

export default exports;