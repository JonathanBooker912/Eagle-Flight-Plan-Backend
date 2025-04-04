import db from "../models/index.js";
// Core Imports
import { Op } from "sequelize";

const FlightPlanItem = db.flightPlanItem;
const FlightPlan = db.flightPlan;
const Task = db.task;
const Experience = db.experience;
const Event = db.event;
const Submission = db.submission;
const Student = db.student;
const User = db.user;
import FileHelpers from "../utilities/fileStorage.helper.js";
// Module Exports Placeholder
const exports = {};

exports.findAllFlightPlanItems = async (page = 1, pageSize = 10) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return await FlightPlanItem.findAll({
    limit,
    offset,
  });
};

exports.findAllFlightPlanItemsByFlightPlanId = async (
  flightPlanId,
  page = 1,
  pageSize = 10,
  searchQuery = "",
  filters = {},
) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const whereCondition = {};

  whereCondition.flightPlanId = flightPlanId;

  if (searchQuery) {
    whereCondition.name = {
      [Op.like]: `%${searchQuery}%`, // Search in the title
    };
  }

  if (filters.status) {
    whereCondition.status = { [Op.eq]: filters.status };
  }

  if (filters.flightPlanItemType) {
    whereCondition.flightPlanItemType = { [Op.eq]: filters.flightPlanItemType };
  }

  let order = [];

  if (filters.sortAttribute && filters.sortDirection) {
    const direction =
      filters.sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    order = [[filters.sortAttribute, direction]];
  }

  const queryOptions = {
    offset,
    limit,
    where: whereCondition,
    order,
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
  };

  const response = await FlightPlanItem.findAll(queryOptions);

  const count = await FlightPlanItem.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(count / pageSize);

  return { count: totalPages, flightPlanItems: response };
};

exports.findOneFlightPlanItem = async (flightPlanItemId) => {
  return await FlightPlanItem.findByPk(flightPlanItemId);
};

exports.getFlightPlanItemTypes = () => {
  return FlightPlanItem.getAttributes().flightPlanItemType.values;
};

exports.getFlightPlanItemStatuses = () => {
  return FlightPlanItem.getAttributes().status.values;
};

exports.getPendingApprovals = async (
  page = 1,
  pageSize = 10,
  searchQuery = "",
) => {
  // Calculate offset for pagination
  const offset = (page - 1) * pageSize;

  // Build the where clause
  const whereClause = { status: "Pending" };

  // Add name filter if search query is provided
  if (searchQuery && searchQuery.trim() !== "") {
    whereClause.name = {
      [Op.like]: `%${searchQuery}%`,
    };
  }

  // Get total count for pagination
  const totalCount = await FlightPlanItem.count({
    where: whereClause,
  });

  // Get paginated results
  const items = await FlightPlanItem.findAll({
    where: whereClause,
    include: [
      {
        model: Task,
        as: "task",
      },
      {
        model: Submission,
        as: "submission",
      },
    ],
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "DESC"]], // Sort by newest first
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    flightPlanItems: items,
    count: totalPages,
  };
};

exports.createFlightPlanItem = async (flightPlanItemData) => {
  return await FlightPlanItem.create(flightPlanItemData);
};

exports.createSubmission = async (flightPlanItemId, { submissionItems }) => {
  const flightPlanItem = await FlightPlanItem.findOne({
    where: { id: flightPlanItemId },
  });

  if (!flightPlanItem) {
    throw Error(`Can't find flightPlanItem with id: ${flightPlanItemId}`);
  }
  if (flightPlanItem.status == "Complete") {
    throw Error(`This flight plan item is already completed`);
  }
  // If the submission type is text

  // If the submission type is files

  submissionItems.forEach(async (submissionItem) => {
    if (submissionItem.submissionType == "text") {
      await SubmissionItem.create(submissionItem);
      return;
    }

    FileHelpers.upload({ ...submissionItem, folder: "submission" });
  });
};

exports.updateFlightPlanItem = async (flightPlanItemData, flightPlanItemId) => {
  return await FlightPlanItem.update(flightPlanItemData, {
    where: { id: flightPlanItemId },
  });
};

exports.approveFlightPlanItem = async (flightPlanItemId) => {
  return await FlightPlanItem.update(
    { status: "Complete" },
    { where: { id: flightPlanItemId } },
  );
};

exports.rejectFlightPlanItem = async (flightPlanItemId) => {
  return await FlightPlanItem.update(
    { status: "Rejected" },
    { where: { id: flightPlanItemId } },
  );
};

exports.deleteFlightPlanItem = async (flightPlanItemId) => {
  return await FlightPlanItem.destroy({ where: { id: flightPlanItemId } });
};

export default exports;
