// link.controller.js
import Link from "../models/link.model.js"; // Adjust the import according to your setup

const exports = {};

exports.findAllLinksForStudent = async (req, res) => {
  const studentId = req.params.id;

  try {
    const links = await Link.findAll({
      where: { studentId },
      attributes: ["id", "websiteName", "link", "createdAt", "updatedAt"],
    });

    res.status(200).json(links); // Send the links as a response
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching links", error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { userId, websiteName, link } = req.body;
    const newLink = await Link.create({
      studentId: userId,
      websiteName,
      link
    });
    res.status(201).json(newLink);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating link", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { websiteName, link } = req.body;
    const updatedLink = await Link.update(
      { websiteName, link },
      { where: { id } }
    );
    if (updatedLink[0] === 0) {
      return res.status(404).json({ message: "Link not found" });
    }
    const updatedLinkData = await Link.findByPk(id);
    res.status(200).json(updatedLinkData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating link", error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Link.destroy({ where: { id } });
    if (deleted === 0) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.status(200).json({ message: "Link deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting link", error: err.message });
  }
};

export default exports;
