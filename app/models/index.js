import { Sequelize } from "sequelize";

import BadExpTask from "./badExpTask.model.js";
import BadgeFulfill from "./badgeFulfill.model.js";
import Badge from "./badge.model.js";
import Event from "./event.model.js";
import EventType from "./eventType.model.js";
import EventStrength from "./eventStrength.model.js";
import Experience from "./experience.model.js";
import ExperienceMajors from "./experienceMajors.model.js";
import ExperienceOptions from "./experienceOptions.model.js";
import FlightPlan from "./flightPlan.model.js";
import FlightPlanItem from "./flightPlanItem.model.js";
import Majors from "./majors.model.js";
import Notifications from "./notifications.model.js";
import Reward from "./reward.model.js";
import Role from "./role.model.js";
import Semester from "./semester.model.js";
import Strength from "./strength.model.js";
import Students from "./students.model.js";
import StudentBadge from "./studentBadge.model.js";
import StudentMajor from "./studentMajor.model.js";
import StudentReward from "./studentReward.model.js";
import StudentStrength from "./studentStrength.model.js";
import Task from "./task.model.js";
import TaskMajors from "./taskMajors.model.js";
import User from "./user.model.js";
import UserRole from "./userrole.model.js";

const db = {};

db.badExpTask = BadExpTask;
db.badgeFulfill = BadgeFulfill;
db.badge = Badge;
db.event = Event;
db.eventType = EventType;
db.eventStrength = EventStrength;
db.experience = Experience;
db.experienceMajors = ExperienceMajors;
db.experienceOptions = ExperienceOptions;
db.flightPlan = FlightPlan;
db.flightPlanItem = FlightPlanItem;
db.majors = Majors;
db.notifications = Notifications;
db.reward = Reward;
db.role = Role;
db.semester = Semester;
db.strength = Strength;
db.students = Students;
db.studentBadge = StudentBadge;
db.studentMajor = StudentMajor;
db.studentReward = StudentReward;
db.studentStrength = StudentStrength;
db.task = Task;
db.taskMajors = TaskMajors;
db.user = User;
db.userRole = UserRole;

db.Sequelize = Sequelize;

/* foreign key for session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);*/

// Foreign Key for studentMajor
// StudentMajor to Majors
db.studentMajor.belongsTo(db.majors, {
  as: "major",
  foreignKey: { name: "majorId", allowNull: false },
});

// Majors to StudentMajor
db.majors.hasMany(db.studentMajor, {
  as: "studentMajors", // Alias for reverse association
  foreignKey: "majorId",
});

// Student to Student Major
db.students.hasMany(db.studentMajor, {
  as: "studentMajors",
  foreignKey: { name: "studentId", allowNull: false }, // Foreign key in studentMajor table
});

// Student Major to Student
db.studentMajor.belongsTo(db.Students, {
  as: "student", // Alias for this relationship
  foreignKey: { name: "studentId", allowNull: false }, // Foreign key in studentMajor table
});

// USERROLE
// User Role to User
db.userRole.belongsTo(db.user, {
  as: "user",
  foreignKey: { name: "userId", allowNull: false },
});

// User Role to Role
db.userRole.belongsTo(db.role, {
  as: "role",
  foreignKey: { name: "roleId", allowNull: false },
});

// STUDENTSTRENGTH

// Student Strength to Student
db.studentStrength.belongsTo(db.students, {
  as: "students",
  foreignKey: { name: "studentID", allowNull: false },
});

// Flight Plan
// Flight Plan to Students
db.flightPlan.hasOne(db.students, {
  as: "students",
  foreignKey: { name: "studentId", allowNull: false },
});

// Flight Plan to Semester
db.flightPlan.hasOne(db.semester, {
  as: "semester",
  foreignKey: { name: "semesterId", allowNull: false },
});

// Flight Plan Item
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

//EXPOPTIONS

// Exp Option to Event
db.experienceOptions.hasOne(db.event, {
  as: "event",
  foreignKey: { name: "eventId", allowNull: false },
});

// Exp Option to Experience
db.experienceOptions.hasOne(db.experience, {
  as: "experience",
  foreignKey: { name: "experienceId", allowNull: false },
});

// EVENT

// Event to Event Type
db.event.hasOne(db.eventType, {
  as: "eventType",
  foreignKey: { name: "type", allowNull: false },
});

// TASK MAJORS

// TaskMajors to Task
db.taskMajors.hasOne(db.task, {
  as: "task",
  foreignKey: { name: "taskId", allowNull: false },
});

// TaskMajors to Major
db.taskMajors.hasOne(db.majors, {
  as: "majors",
  foreignKey: { name: "majorId", allowNull: false },
});

// EXPERIENCE MAJORS

// ExperienceMajors to Experience
db.experienceMajors.hasOne(db.experience, {
  as: "experience",
  foreignKey: { name: "experienceId", allowNull: false },
});

// ExperienceMajor to Major
db.experienceMajors.hasOne(db.majors, {
  as: "majors",
  foreignKey: { name: "majorId", allowNull: false },
});

// BADEXPTASK

// BadExpTask to Task
db.badExpTask.hasOne(db.task, {
  as: "task",
  foreignKey: { name: "taskId", allowNull: false },
});

// BadExpTask to Major
db.experienceMajors.hasOne(db.experience, {
  as: "experience",
  foreignKey: { name: "experienceId", allowNull: false },
});

// BADGE FULFILL

// BadgeFulfill to Badge
db.badgeFulfill.hasOne(db.badge, {
  as: "badge",
  foreignKey: { name: "badgeId", allowNull: false },
});

// BadgeFulfill to Student
db.badgeFulfill.hasOne(db.students, {
  as: "students",
  foreignKey: { name: "studentId", allowNull: false },
});

// STUDENT BADGE

// stu to Badge
db.studentBadge.hasOne(db.badge, {
  as: "badge",
  foreignKey: { name: "badgeId", allowNull: false },
});

// BadgeFulfill to Student
db.studentBadge.hasOne(db.students, {
  as: "students",
  foreignKey: { name: "studentId", allowNull: false },
});

export default db;
