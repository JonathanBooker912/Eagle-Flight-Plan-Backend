import db from "../models/index.js";
import FileHelpers from "../utilities/fileStorage.helper.js";
const Submission = db.submission;

const exports = {};

exports.create = async (submissionData) => {
  console.log(submissionData);
  return await Submission.create(submissionData);
};

exports.findAllForFlightPlanItem = async (flightPlanItemId) => {
  let submissions = await Submission.findAll({
    where: { flightPlanItemId },
  });

  submissions = getFilesForSubmissions(submissions);

  return { count: submissions.length, submissions };
};

exports.discardSubmissionForFlightPlanItem = async (flightPlanItemId) => {
  const submissions = await Submission.findAll({ where: { flightPlanItemId } });
  submissions.forEach((submission) => {
    if (submission.submissionType == "file") {
      FileHelpers.remove(submission.value);
    }
  });
  return await Submission.destroy({ where: { flightPlanItemId } });
};

const getFilesForSubmissions = (submissions) => {
  const response = submissions.map((submission) => {
    if (submission.submissionType == "file") {
      let fileName = submission.value;
      submission.value = FileHelpers.read(submission.value);
      return { ...submission.dataValues, fileName };
    }
    return submission;
  });

  return response;
};

export default exports;
