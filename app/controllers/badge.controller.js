import db from "../models/index.js";
const Badge = db.badge;
const BadgeAwarded = db.badgeAwarded;
import { Op } from "sequelize";

const exports = {};

exports.create = async (req, res) => {
  try {
    const badge = await Badge.create(req.body);
    res.status(201).json(badge);
  } catch (err) {
    console.error("Error creating badge:", err);
    res.status(500).json({
      message: err.message || "Some error occurred while creating the badge.",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const badge = await Badge.findByPk(req.params.id);
    if (badge) {
      res.json(badge);
    } else {
      res.status(404).json({
        message: `Cannot find badge with id = ${req.params.id}.`,
      });
    }
  } catch (err) {
    console.error("Error retrieving badge:", err);
    res.status(500).json({
      message: "Error retrieving badge with id = " + req.params.id,
    });
  }
};

exports.getBadgesForStudent = async (req, res) => {
  const studentId = req.params.id;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = 6; // Fixed page size of 6
  const offset = (page - 1) * pageSize;

  try {
    const { count, rows: badges } = await Badge.findAndCountAll({
      include: [
        {
          model: BadgeAwarded,
          as: "badgeAwarded",
          where: { studentId },
          required: true,
        },
      ],
      offset,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / pageSize);

    // If requested page is beyond total pages, adjust the query
    if (page > totalPages && totalPages > 0) {
      const adjustedOffset = (totalPages - 1) * pageSize;
      const { rows: adjustedBadges } = await Badge.findAndCountAll({
        include: [
          {
            model: BadgeAwarded,
            as: "badgeAwarded",
            where: { studentId },
            required: true,
          },
        ],
        offset: adjustedOffset,
        limit: pageSize,
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        badges: adjustedBadges,
        total: count,
      });
    }

    res.status(200).json({
      badges,
      total: count,
    });
  } catch (err) {
    console.error("Error fetching badges for student:", err);
    res.status(500).json({
      message: "Error retrieving badges for student",
      error: err.message,
    });
  }
};

exports.findAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const searchQuery = req.query.search || "";
  const offset = (page - 1) * pageSize;

  try {
    const whereCondition = searchQuery
      ? {
          name: {
            [Op.like]: `%${searchQuery}%`,
          },
        }
      : {};

    const { count, rows: badges } = await Badge.findAndCountAll({
      where: whereCondition,
      offset,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / pageSize);

    res.status(200).json({
      badges,
      count: totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching badges:", err);
    res.status(500).json({
      message: "Error retrieving badges",
      error: err.message,
    });
  }
};

exports.getRuleTypes = async (req, res) => {
  res.send(Badge.getRuleTypes());
};

exports.getUnviewedBadges = async (req, res) => {
  const studentId = req.params.id;

  try {
    const result = await Badge.getUnviewedBadges(studentId);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message:
        "Error retrieving unviewed badges for student with id = " + studentId,
    });
    console.log("Error: ", err);
  }
};

exports.viewBadge = async (req, res) => {
  const badgeId = req.params.id;
  await Badge.viewBadge(badgeId).then((data) => {
    res.send(data);
  });
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Badge.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedBadge = await Badge.findByPk(req.params.id);
      res.json(updatedBadge);
    } else {
      res.status(404).json({
        message: `Cannot find badge with id = ${req.params.id}.`,
      });
    }
  } catch (err) {
    console.error("Error updating badge:", err);
    res.status(500).json({
      message: "Error updating badge",
      error: err.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Badge.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.json({ message: "Badge was deleted successfully!" });
    } else {
      res.status(404).json({
        message: `Cannot find badge with id = ${req.params.id}.`,
      });
    }
  } catch (err) {
    console.error("Error deleting badge:", err);
    res.status(500).json({
      message: "Could not delete badge",
      error: err.message,
    });
  }
};

export default exports;
