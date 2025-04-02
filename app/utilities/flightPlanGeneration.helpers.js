export const getAllCompletedFlightPlanItemsForStudent = (student) => {
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

export const getTasksForNewFlightPlan = (completedTasks, allTasks) => {
  if (!allTasks) return [];
  else if (!completedTasks) return allTasks;

  return allTasks.filter(({ id }) => !completedTasks.includes(id));
};

export const getExperiencesForNewFlightPlan = (
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

export const getOneTimeExperiences = (
  completedExperienceIds,
  allOneTimeExperiences,
) => {
  if (!allOneTimeExperiences) return [];
  else if (!completedExperienceIds) return allOneTimeExperiences;

  return allOneTimeExperiences.filter(
    ({ id }) => !completedExperienceIds.includes(id),
  );
};
