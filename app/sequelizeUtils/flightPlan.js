// Models
import db from "../models/index.js";
const {
  flightPlan: FlightPlan,
  flightPlanItem: FlightPlanItem,
  task: Task,
  experience: Experience,
  event: Event,
} = db;

// Sequelize Utilities
import Student from "../sequelizeUtils/student.js";
import Semester from "../sequelizeUtils/semester.js";

// Helpers
import {
  getAllCompletedFlightPlanItemsForStudent,
  getTasksForNewFlightPlan,
  getExperiencesForNewFlightPlan,
} from "../utilities/flightPlanGeneration.helpers.js";

// Controllers or Services
import { getAllTasksGreaterThanSemestersFromGrad } from "./task.js";
import { getAllExperiences } from "./experience.js";

// Module Exports Placeholder
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

  const student = await Student.getStudentWithFlightPlanInfo(studentId);
  const currentSemester = await Semester.getCurrentSemester();

  if (!currentSemester) {
    throw Error("Unable to get current semester");
  }
  if (!student) {
    throw Error(`Unable to find student with id: ${studentId}`);
  }
  if (student.flightPlanItems[0]?.semestersFromGrad < 0) {
    throw Error("Student semesters from graduation can't be negative");
  }
  if (student.flightPlans[0]?.semestersFromGrad === student.semestersFromGrad) {
    throw Error("Student's flight plan has already been generated");
  }

  // // This is running under the assumption that the students semestersFromGrad has already been decremented and it is the current and updated value.
  const flightPlanData = {
    studentId,
    semesterId: currentSemester.id,
    semestersFromGrad: student.semestersFromGrad,
  };

  const flightPlan = await FlightPlan.create(flightPlanData);

  const flightPlanItems = await getFlightPlanItemsForNewFlightPlan(
    student,
    flightPlan,
  );

  flightPlanItems.forEach(async (flightPlanItem) => {
    await FlightPlanItem.create(flightPlanItem);
  });

  return await exports.findFlightPlan(flightPlan.id);
};

exports.findFlightPlanForStudent = async (studentId) => {
  return await FlightPlan.findAll({
    where: { studentId },
    include: [
      {
        model: FlightPlanItem,
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

exports.findFlightPlan = async (id) => {
  return await FlightPlan.findOne({
    where: { id },
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

// Non default exports
export const getFlightPlanItemsForNewFlightPlan = async (
  student,
  newFlightPlan,
) => {
  const completedItems = getAllCompletedFlightPlanItemsForStudent(student);

  /* eslint-disable no-undef */
  const [taskItems, experienceItems] = await Promise.all([
    getTaskItems(completedItems, newFlightPlan),
    getExperienceItems(completedItems, newFlightPlan),
  ]);

  const formatItem = (type, item) => ({
    flightPlanItemType: type,
    status: "Incomplete",
    [`${type.toLowerCase()}Id`]: item.id,
    pointsEarned: item.points,
    flightPlanId: newFlightPlan.id,
    name: item.name,
  });

  return [
    ...taskItems.map((task) => formatItem("Task", task)),
    ...experienceItems.map((exp) => formatItem("Experience", exp)),
  ];
};

export const getTaskItems = async (completedItems, newFlightPlan) => {
  const completedTaskIds = completedItems
    .filter(({ flightPlanItemType }) => flightPlanItemType === "Task")
    .map(({ taskId }) => taskId);

  const allTasks = await getAllTasksGreaterThanSemestersFromGrad(
    newFlightPlan.semestersFromGrad,
  );
  return getTasksForNewFlightPlan(completedTaskIds, allTasks);
};

export const getExperienceItems = async (completedItems, newFlightPlan) => {
  const completedExperienceIds = completedItems
    .filter(({ flightPlanItemType }) => flightPlanItemType === "Experience")
    .map(({ experienceId }) => experienceId);

  let allExperiences = await getAllExperiences();

  const allOneTimeExperiences = allExperiences.filter(
    ({ schedulingType, semestersFromGrad }) =>
      schedulingType === "one-time" &&
      semestersFromGrad >= newFlightPlan.semestersFromGrad,
  );

  const allEverySemesterExperiences = allExperiences.filter(
    ({ schedulingType }) => schedulingType === "every semester",
  );

  const experienceItems = getExperiencesForNewFlightPlan(
    completedExperienceIds,
    allOneTimeExperiences,
    allEverySemesterExperiences,
  );

  return experienceItems;
};
