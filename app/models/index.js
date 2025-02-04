import { Sequelize } from "sequelize";

import user from "./user.model.js";
import session from "./session.model.js";

import role from "./role.model.js";
import userRole from "./userrole.model.js";

const db = {};

db.user = user;
db.session = session;

db.role = role;
db.userRole = userRole;

db.Sequelize = Sequelize;

// foreign key for session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);
db.session.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// Foreign key for user in user role
db.user.hasMany(
  db.userRole,
  { as: "userRole" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

db.userRole.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// Foreign key for role in user role
db.role.hasMany(
  db.userRole,
  { as: "userRole" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

db.userRole.belongsTo(db.role, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

export default db;
