import db from "../models/index.js";
const Task = db.task;
const Experience = db.experience;
const Student = db.student;
const Major = db.major;
const Strength = db.strength;
const FlightPlan = db.flightPlan;

export const getFlightPlanItemsForNewFlightPlan = async (
  studentId,
  newFlightPlan,
) => {
  const student = await getStudentWithGenerationInfo(studentId);

  const completedItems = getAllCompletedFlightPlanItemsForStudent(student);

  /* eslint-disable no-undef */
  const [taskItems, experienceItems] = await Promise.all([
    getTaskItems(completedItems, newFlightPlan, student),
    getExperienceItems(completedItems, newFlightPlan, student),
  ]);

  const formatItem = (type, item) => ({
    flightPlanItemType: type,
    status: "Incomplete",
    [`${type.toLowerCase()}Id`]: item.id,
    flightPlanId: newFlightPlan.id,
    name: item.name,
  });

  return [
    ...taskItems.map((task) => formatItem("Task", task)),
    ...experienceItems.map((exp) => formatItem("Experience", exp)),
  ];
};

const getStudentWithGenerationInfo = async (studentId) => {
  return await Student.findOne({
    where: { id: studentId },
    include: [
      { model: FlightPlan, as: "flightPlans" },
      { model: Major, as: "majors" },
      { model: Strength, as: "strengths" },
    ],
  });
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

const getTaskItems = async (completedItems, newFlightPlan, student) => {
  const completedTaskIds = completedItems
    .filter(({ flightPlanItemType }) => flightPlanItemType === "Task")
    .map(({ taskId }) => taskId);

  const allTasks = await getAllTasksGreaterThanSemestersFromGrad(
    newFlightPlan.semestersFromGrad,
  );

  const nonSpecificTasks = allTasks.filter(
    (task) => task.strengths.length == 0 && task.majors.length == 0,
  );

  const finalNonSpecificTasks = processNonSpecificTasks(
    completedTaskIds,
    nonSpecificTasks,
  );

  const specificTasks = allTasks.filter(
    (task) => task.strengths.length > 0 || task.majors.length > 0,
  );

  const finalSpecificTasks = processSpecificTasks(
    completedTaskIds,
    specificTasks,
    student,
  );

  return [...finalNonSpecificTasks, ...finalSpecificTasks];
};

const getAllTasksGreaterThanSemestersFromGrad = async (semestersFromGrad) => {
  const allTasks = await Task.findAll({
    include: [{ model: Strength }, { model: Major }],
  });
  return allTasks.filter((task) => task.semestersFromGrad >= semestersFromGrad);
};

const processNonSpecificTasks = (completedTaskIds, nonSpecificTasks) => {
  const oneTimeTasks = nonSpecificTasks.filter(
    (task) => task.schedulingType === "one-time",
  );

  const everySemesterTasks = nonSpecificTasks.filter(
    (task) => task.schedulingType === "every semester",
  );

  const uncompletedOneTimeTasks = oneTimeTasks.filter(
    (task) => !completedTaskIds.includes(task.id),
  );

  return [...uncompletedOneTimeTasks, ...everySemesterTasks];
};

const processSpecificTasks = (completedTaskIds, specificTasks, student) => {
  const relevantSpecificTasks = specificTasks.filter(
    (task) =>
      task.strengths.some((strength) => student.strengths.includes(strength)) ||
      task.majors.some((major) => student.majors.includes(major)),
  );

  const oneTimeSpecificTasks = relevantSpecificTasks.filter(
    (task) => task.schedulingType === "one-time",
  );

  const uncompletedOneTimeSpecificTasks = oneTimeSpecificTasks.filter(
    (task) => !completedTaskIds.includes(task.id),
  );

  const everySemesterSpecificTasks = relevantSpecificTasks.filter(
    (task) => task.schedulingType === "every semester",
  );

  return [...uncompletedOneTimeSpecificTasks, ...everySemesterSpecificTasks];
};

const getExperienceItems = async (completedItems, newFlightPlan, student) => {
  const completedExperienceIds = completedItems
    .filter(({ flightPlanItemType }) => flightPlanItemType === "Experience")
    .map(({ experienceId }) => experienceId);

  let allExperiences = await getAllExperiencesGreaterThanSemestersFromGrad(
    newFlightPlan.semestersFromGrad,
  );

  const nonSpecificExperiences = allExperiences.filter(
    (experience) =>
      experience.strengths.length == 0 && experience.majors.length == 0,
  );

  const finalNonSpecificExperiences = processNonSpecificExperiences(
    completedExperienceIds,
    nonSpecificExperiences,
  );

  const specificExperiences = allExperiences.filter(
    (experience) =>
      experience.strengths.length > 0 || experience.majors.length > 0,
  );

  const finalSpecificExperiences = processSpecificExperiences(
    completedExperienceIds,
    specificExperiences,
    student,
  );

  return [...finalNonSpecificExperiences, ...finalSpecificExperiences];
};

const getAllExperiencesGreaterThanSemestersFromGrad = async (
  semestersFromGrad,
) => {
  const allExperiences = await Experience.findAll({
    include: [{ model: Strength }, { model: Major }],
  });
  return allExperiences.filter(
    (experience) => experience.semestersFromGrad >= semestersFromGrad,
  );
};

const processNonSpecificExperiences = (
  completedExperienceIds,
  nonSpecificExperiences,
) => {
  const oneTimeExperiences = nonSpecificExperiences.filter(
    (experience) => experience.schedulingType === "one-time",
  );

  const everySemesterExperiences = nonSpecificExperiences.filter(
    (experience) => experience.schedulingType === "every semester",
  );

  const uncompletedOneTimeExperiences = oneTimeExperiences.filter(
    (experience) => !completedExperienceIds.includes(experience.id),
  nonSpecificExperiences,
) => {
  const oneTimeExperiences = nonSpecificExperiences.filter(
    (experience) => experience.schedulingType === "one-time",
  );

  const everySemesterExperiences = nonSpecificExperiences.filter(
    (experience) => experience.schedulingType === "every semester",
  );

  const uncompletedOneTimeExperiences = oneTimeExperiences.filter(
    (experience) => !completedExperienceIds.includes(experience.id),
  );

  return [...uncompletedOneTimeExperiences, ...everySemesterExperiences];

  return [...uncompletedOneTimeExperiences, ...everySemesterExperiences];
};

const processSpecificExperiences = (
  completedExperienceIds,
  specificExperiences,
  student,
) => {
  const relevantSpecificExperiences = specificExperiences.filter(
    (experience) =>
      experience.strengths.some((strength) =>
        student.strengths.includes(strength),
      ) || experience.majors.some((major) => student.majors.includes(major)),
  );

  const oneTimeSpecificExperiences = relevantSpecificExperiences.filter(
    (experience) => experience.schedulingType === "one-time",
  );

  const uncompletedOneTimeSpecificExperiences =
    oneTimeSpecificExperiences.filter(
      (experience) => !completedExperienceIds.includes(experience.id),
    );

  const everySemesterSpecificExperiences = relevantSpecificExperiences.filter(
    (experience) => experience.schedulingType === "every semester",
  );

  return [
    ...uncompletedOneTimeSpecificExperiences,
    ...everySemesterSpecificExperiences,
  ];
  specificExperiences,
  student,
) => {
  const relevantSpecificExperiences = specificExperiences.filter(
    (experience) =>
      experience.strengths.some((strength) =>
        student.strengths.includes(strength),
      ) || experience.majors.some((major) => student.majors.includes(major)),
  );

  const oneTimeSpecificExperiences = relevantSpecificExperiences.filter(
    (experience) => experience.schedulingType === "one-time",
  );

  const uncompletedOneTimeSpecificExperiences =
    oneTimeSpecificExperiences.filter(
      (experience) => !completedExperienceIds.includes(experience.id),
    );

  const everySemesterSpecificExperiences = relevantSpecificExperiences.filter(
    (experience) => experience.schedulingType === "every semester",
  );

  return [
    ...uncompletedOneTimeSpecificExperiences,
    ...everySemesterSpecificExperiences,
  ];
};
