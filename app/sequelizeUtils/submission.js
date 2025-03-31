import db from "../models/index.js";
const Submission = db.submission;

const exports = {};

exports.create = async (submissionData) => {
  return await Submission.create(submissionData);
};

export default exports;
