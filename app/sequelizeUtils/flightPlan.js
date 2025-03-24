import { Op } from "sequelize";
import db from "../models/index.js";
import Student from "../sequelizeUtils/student.js";
import Semester from "../sequelizeUtils/semester.js";
const FlightPlan = db.flightPlan;
const FlightPlanItem = db.flightPlanItem;
const Task = db.task;
const Experience = db.experience;
const Event = db.event;
const exports = {};

exports.findAllFlightPlans = async (page = 1, pageSize = 10) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return await FlightPlan.findAll({
    limit,
    offset,
  });
};

exports.generateFlightPlan = async (studentId) => {
  if (!studentId) {
    throw Error("Unable to generate flight plan for student with invalid id");
  }

  const student = (await Student.getStudentWithFlightPlanInfo(studentId))[0];
  const currentSemester = await Semester.getCurrentSemester();
  const existingFlightPlans = await exports.findFlightPlanForStudent(studentId);

  if (!currentSemester) {
    throw Error("Unable to get current semester");
  }
  if (!student) {
    throw Error(`Unable to find student with id: ${studentId}`);
  }

  const flightPlanData = {
    studentId,
    semesterId: currentSemester.id,
    semestersFromGrad: student.semestersFromGrad,
  };

  const flightPlan = await FlightPlan.create(flightPlanData);

  const tasks = await Task.findAll({
    where: {
      semestersFromGrad: {
        [Op.gte]: student.semestersFromGrad,
      },
    },
  });

  const experiences = await Experience.findAll();

  const flightPlanItemTasks = tasks.map((task) => {
    return {
      type: "Task",
      status: "Incomplete",
      taskId: task.id,
      pointsEarned: 10,
      flightPlanId: flightPlan.id,
    };
  });

  const flightPlanItemExperiences = experiences.map((experience) => {
    return {
      type: "Experience",
      status: "Incomplete",
      experienceId: experience.id,
      pointsEarned: 10,
      flightPlanId: flightPlan.id,
    };
  });

  flightPlanItemTasks.forEach(async (itemTask) => {
    await FlightPlanItem.create(itemTask);
  });

  flightPlanItemExperiences.forEach(async (itemExperience) => {
    await FlightPlanItem.create(itemExperience);
  });
};

exports.findFlightPlanForStudent = async (studentId) => {
  return await FlightPlan.findAll({
    where: { studentId },
    include: [
      {
        model: FlightPlanItem,
        attributes: ["flightPlanItemType", "status", "id"],
        include: [
          {
            model: Task,
            as: "task",
          },
          {
            model: Experience,
            as: "experience",
          },
          {
            model: Event,
            as: "event",
          },
        ],
      },
    ],
  });
};

exports.findProgressForFlightPlan = async (flightPlanId) => {
  const response = await FlightPlanItem.findAll({ where: { flightPlanId } });
  let completed = response.reduce((previous, current) => {
    return previous + (current.status == "Complete" ? 1 : 0);
  }, 0);

  const progress =
    response.length > 0 ? Math.round(100 * (completed / response.length)) : 0; // Prevent division by zero

  return { progress };
};

exports.findOneFlightPlan = async (flightPlanId) => {
  return await FlightPlan.findByPk(flightPlanId);
};

exports.createFlightPlan = async (flightPlanData) => {
  return await FlightPlan.create(flightPlanData);
};

exports.updateFlightPlan = async (flightPlanData, flightPlanId) => {
  return await FlightPlan.update(flightPlanData, {
    where: { id: flightPlanId },
  });
};

exports.deleteFlightPlan = async (flightPlanId) => {
  return await FlightPlan.destroy({ where: { id: flightPlanId } });
};

export default exports;
