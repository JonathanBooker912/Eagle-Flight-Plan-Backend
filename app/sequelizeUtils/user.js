import db from "../models/index.js";
const User = db.user;
const Op = db.Sequelize.Op;

const exports = {};

exports.create = async (userData) => {
  return await User.create(userData);
};

exports.findAll = async ({
  id,
  email,
  filter,
  offset = 0,
  limit = 10000000,
}) => {
  let condition = null;

  if (filter) {
    condition = {
      [Op.or]: [
        { fName: { [Op.like]: `%${filter}%` } },
        { lName: { [Op.like]: `%${filter}%` } },
        { email: { [Op.like]: `%${filter}%` } },
      ],
    };
  } else if (id) {
    condition = { id: { [Op.like]: `%${id}%` } };
  } else if (email) {
    condition = { email: { [Op.like]: `%${email}%` } };
  }

  return await User.findAndCountAll({ where: condition, offset, limit });
};

exports.findById = async (id) => {
  return await User.findByPk(id);
};

exports.findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

exports.update = async (id, updateData) => {
  return await User.update(updateData, { where: { id } });
};

exports.delete = async (id) => {
  return await User.destroy({ where: { id } });
};

export default exports;
