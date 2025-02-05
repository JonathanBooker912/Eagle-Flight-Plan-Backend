import { Sequelize } from "sequelize";

import BadExpTask from "./badExpTask.model.js";
import BadgeFulfill from "./badgeFulfill.model.js";
import Badge from "./badge.model.js";
import Event from "./event.model.js";
import EventType from "./eventType.model.js";
import Experience from "./experience.model.js";
import FlightPlan from "./flightPlan.model.js";
import FlightPlanItem from "./flightPlanItem.model.js";
import Major from "./major.model.js";
import Notifications from "./notifications.model.js";
import Reward from "./reward.model.js";
import Role from "./role.model.js";
import Semester from "./semester.model.js";
import Strength from "./strength.model.js";
import Student from "./student.model.js";
import Task from "./task.model.js";
import User from "./user.model.js";

const db = {};

db.badExpTask = BadExpTask;
db.badgeFulfill = BadgeFulfill;
db.badge = Badge;
db.event = Event;
db.eventType = EventType;
db.experience = Experience;
db.flightPlan = FlightPlan;
db.flightPlanItem = FlightPlanItem;
db.major = Major;
db.notifications = Notifications;
db.reward = Reward;
db.role = Role;
db.semester = Semester;
db.strength = Strength;
db.student = Student;
db.task = Task;
db.user = User;

db.Sequelize = Sequelize;

/* foreign key for session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);*/

//User.belongsToMany(Profile, { through: 'User_Profiles' });
//Profile.belongsToMany(User, { through: 'User_Profiles' });

// Joint Tables

// USERROLE
User.belongsToMany(Role, { through: "UserRole" });
Role.belongsToMany(User, { through: "UserRole" });

// STUDENTBADGE
Student.belongsToMany(Badge, { through: "StudentBadge" });
Badge.belongsToMany(Student, { through: "StudentBadge" });

// BADEXPTASK
Badge.belongsToMany(Task, { through: "badexptask" });
Task.belongsToMany(Badge, { through: "badexptask" });

// BADGEFULFILL
Badge.belongsToMany(Student, { through: "BadgeFulfill" });
Student.belongsToMany(Badge, { through: "BadgeFulfill" });

// STUDENTMAJOR
Student.belongsToMany(Major, { through: "studentMajor" });
Major.belongsToMany(Student, { through: "studentMajors" });

// TASKMAJOR
Task.belongsToMany(Major, { through: "TaskMajor" });
Major.belongsToMany(Task, { through: "TaskMajor" });

// EXPERIENCEMAJORS
Experience.belongsToMany(Major, { through: "ExperienceMajor" });
Major.belongsToMany(Experience, { through: "ExperienceMajor" });

// EXPOPTIONS
Experience.belongsToMany(Event, { through: "ExpOption" });
Event.belongsToMany(Experience, { through: "ExpOption" });

// EVENTSTRENGTH
Event.belongsToMany(Strength, { through: "EventStrength" });
Strength.belongsToMany(Event, { through: "EventStrength" });

// Flight Plan to Semester
db.flightPlan.hasOne(db.semester, {
  as: "semester",
  foreignKey: { name: "semesterId", allowNull: false },
});

// Flight Plan Item to ???? (Approved By)

// Flight Plan to Event ??? (No relation)

// Flight Plan to Experience
db.flightPlanItem.hasOne(db.experience, {
  as: "experience",
  foreignKey: { name: "experienceId", allowNull: false },
});

// Flight Plan to Task
db.flightPlanItem.hasOne(db.task, {
  as: "task",
  foreignKey: { name: "taskId", allowNull: false },
});

// EVENT

// Event to Event Type
db.event.hasOne(db.eventType, {
  as: "eventType",
  foreignKey: { name: "type", allowNull: false },
});

export default db;
