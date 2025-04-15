import db from "../models/index.js";
const Task = db.task;
const Experience = db.experience;
const Student = db.student;
const Major = db.major;
const Strength = db.strength;
const FlightPlan = db.flightPlan;
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

export const getStudentWithGenerationInfo = async (studentId) => {
  return await Student.findOne({
    where: { id: studentId },
    include: [
      { model: FlightPlan, as: "flightPlans" },
      { model: Major, as: "majors" },
      { model: Strength, as: "strengths" },
    ],
  });
};

const getTaskItems = async (completedItems, newFlightPlan) => {
  const completedTaskIds = completedItems
    .filter(({ flightPlanItemType }) => flightPlanItemType === "Task")
    .map(({ taskId }) => taskId);
  const allTasks = await getAllTasksGreaterThanSemestersFromGrad(
    newFlightPlan.semestersFromGrad,
  );

  return getTasksForNewFlightPlan(completedTaskIds, allTasks);
};

const getAllTasksGreaterThanSemestersFromGrad = async (semestersFromGrad) => {
  const allTasks = await Task.findAll({
    include: [{ model: Strength }, { model: Major }],
  });
  return allTasks.filter((task) => task.semestersFromGrad >= semestersFromGrad);
};

const getExperienceItems = async (completedItems, newFlightPlan) => {
  const completedExperienceIds = completedItems
    .filter(({ flightPlanItemType }) => flightPlanItemType === "Experience")
    .map(({ experienceId }) => experienceId);

  let allExperiences = await Experience.findAll();

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

const getAllCompletedFlightPlanItemsForStudent = (student) => {
  let completedFlightPlanItems = [];

  student.flightPlans?.forEach((flightPlan) => {
    let newItems =
      flightPlan.flightPlanItems?.filter(
        ({ status }) => status === "Complete",
      ) || [];
    completedFlightPlanItems = [...completedFlightPlanItems, ...newItems];
  });

  return completedFlightPlanItems;
};

const getTasksForNewFlightPlan = (completedTasks, allTasks) => {
  if (!allTasks) return [];

  allTasks = allTasks.filter((task) => !completedTasks.includes(task.id));

  return allTasks.filter((task) => {
    return task.strengths.length == 0 && task.majors.length == 0;
  });
};

const getExperiencesForNewFlightPlan = (
  completedExperienceIds,
  allOneTimeExperiences,
  allEverySemesterExperiences,
) => {
  const oneTimeExperiences = getOneTimeExperiences(
    completedExperienceIds,
    allOneTimeExperiences,
  );
  return [...oneTimeExperiences, ...allEverySemesterExperiences];
};

const getOneTimeExperiences = (
  completedExperienceIds,
  allOneTimeExperiences,
) => {
  if (!allOneTimeExperiences) return [];
  else if (!completedExperienceIds) return allOneTimeExperiences;

  return allOneTimeExperiences.filter(
    ({ id }) => !completedExperienceIds.includes(id),
  );
};
