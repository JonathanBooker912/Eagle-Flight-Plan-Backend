import { Sequelize } from "sequelize";

import BadExpTask from "./badExpTask.model.js";
import BadgeAwarded from "./badgeAwarded.model.js";
import Badge from "./badge.model.js";
import Event from "./event.model.js";
import EventCheckinTokens from "./eventCheckinTokens.js";
import EventType from "./eventType.model.js";
import Experience from "./experience.model.js";
import FlightPlan from "./flightPlan.model.js";
import FlightPlanItem from "./flightPlanItem.model.js";
import Link from "./link.model.js";
import Major from "./major.model.js";
import Notification from "./notification.model.js";
import Reward from "./reward.model.js";
import Role from "./role.model.js";
import Semester from "./semester.model.js";
import Strength from "./strength.model.js";
import Student from "./student.model.js";
import Task from "./task.model.js";
import User from "./user.model.js";
import Session from "./session.model.js";
import StudentReward from "./studentReward.model.js";
import StudentStrength from "./studentStrength.model.js";
import Submission from "./submission.model.js";
import EventStudents from "./eventStudents.model.js";

const db = {};

db.badExpTask = BadExpTask;
db.BadgeAwarded = BadgeAwarded;
db.badge = Badge;
db.event = Event;
db.eventCheckinTokens = EventCheckinTokens;
db.eventType = EventType;
db.experience = Experience;
db.flightPlan = FlightPlan;
db.flightPlanItem = FlightPlanItem;
db.link = Link;
db.major = Major;
db.notification = Notification;
db.reward = Reward;
db.role = Role;
db.semester = Semester;
db.strength = Strength;
db.student = Student;
db.task = Task;
db.user = User;
db.session = Session;
db.studentReward = StudentReward;
db.StudentStrength = StudentStrength;
db.submission = Submission;
db.eventStudents = EventStudents;

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

User.hasMany(Notification);
Notification.belongsTo(
  User,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" },
);

// foreign key for student/users
db.user.hasOne(db.student, { as: "student", foreignKey: "userId" });
db.student.belongsTo(db.user, { as: "user", foreignKey: "userId" });
// Joint Tables

// USERROLE
User.belongsToMany(Role, { through: "userRole" });
Role.belongsToMany(User, { through: "userRole" });

// STUDENTBADGE
Student.belongsToMany(Badge, { through: "studentBadge" });
Badge.belongsToMany(Student, { through: "studentBadge" });

// BADEXPTASK
Badge.belongsToMany(Task, { through: db.badExpTask });
Task.belongsToMany(Badge, { through: db.badExpTask });

// BadgeAwarded
Badge.belongsToMany(Student, { through: db.BadgeAwarded });
Student.belongsToMany(Badge, { through: db.BadgeAwarded });

// STUDENTMAJOR
Student.belongsToMany(Major, { through: "studentMajor" });
Major.belongsToMany(Student, { through: "studentMajors" });

Student.belongsToMany(Reward, { through: db.studentReward });
Reward.belongsToMany(Student, { through: db.studentReward });

// TASKMAJOR
Task.belongsToMany(Major, { through: "taskMajor" });
Major.belongsToMany(Task, { through: "taskMajor" });

// EXPERIENCEMAJORS
Experience.belongsToMany(Major, { through: "experienceMajor" });
Major.belongsToMany(Experience, { through: "experienceMajor" });

// EXPOPTIONS
Experience.belongsToMany(Event, { through: "expOption" });
Event.belongsToMany(Experience, { through: "expOption" });

// EVENTSTRENGTH
Event.belongsToMany(Strength, { through: "eventStrength" });
Strength.belongsToMany(Event, { through: "eventStrength" });

Student.belongsToMany(Strength, {
  through: StudentStrength,
  foreignKey: "studentId",
});
Strength.belongsToMany(Student, {
  through: StudentStrength,
  foreignKey: "strengthId",
});

// Define associations
EventStudents.belongsTo(Student, { foreignKey: "studentId" });
EventStudents.belongsTo(Event, { foreignKey: "eventId" });
EventStudents.belongsTo(Student, { foreignKey: "studentId" });
EventStudents.belongsTo(Event, { foreignKey: "eventId" });

//Event to Students
db.event.belongsToMany(db.student, {
  through: db.eventStudents,
  foreignKey: "eventId",
  otherKey: "studentId",
});

db.student.belongsToMany(db.event, {
  through: db.eventStudents,
  foreignKey: "studentId",
  otherKey: "eventId",
});

// Event Check-In Tokens to Event
db.event.hasMany(db.eventCheckinTokens, {
  as: "checkinTokens",
  foreignKey: { name: "eventId", allowNull: false },
});

db.eventCheckinTokens.belongsTo(db.event, {
  as: "event",
  foreignKey: { name: "eventId", allowNull: false },
});

/// Flight Plan to Semester
db.flightPlan.hasOne(db.semester, {
  as: "semester",
  foreignKey: { name: "id", allowNull: false },
});
db.semester.hasMany(db.flightPlan);

db.student.hasOne(db.link, {
  as: "link", // Alias for the link in the student model
  foreignKey: {
    name: "studentId", // The foreign key in the links table
    allowNull: false, // The foreign key cannot be null
  },
});

// In the link model:
db.link.belongsTo(db.student, {
  as: "student", // Alias for the student in the link model
  foreignKey: {
    name: "studentId", // The foreign key in the links table
    allowNull: false, // The foreign key cannot be null
  },
});

// Flight plan to student
db.flightPlan.hasOne(db.student, {
  as: "student",
  foreignKey: { name: "id", allowNull: false },
});
db.student.hasMany(db.flightPlan);

// Flight plan to Flight plan Item
db.flightPlanItem.hasOne(db.flightPlan, {
  as: "flightPlan",
  foreignKey: { name: "id", allowNull: false },
});
db.flightPlan.hasMany(db.flightPlanItem);

// Flight plan to Task
// FlightPlanItem belongs to Task
db.flightPlanItem.belongsTo(db.task, {
  as: "task",
  foreignKey: { name: "taskId", allowNull: true },
});
db.task.hasMany(db.flightPlanItem, {
  foreignKey: { name: "taskId", allowNull: true },
});

// FlightPlanItem belongs to Event
db.flightPlanItem.belongsTo(db.event, {
  as: "event",
  foreignKey: { name: "eventId", allowNull: true },
});
db.event.hasMany(db.flightPlanItem, {
  foreignKey: { name: "eventId", allowNull: true },
});

// FlightPlanItem belongs to Experience
db.flightPlanItem.belongsTo(db.experience, {
  as: "experience",
  foreignKey: { name: "experienceId", allowNull: true },
});
db.experience.hasMany(db.flightPlanItem, {
  foreignKey: { name: "experienceId", allowNull: true },
});

db.submission.belongsTo(db.flightPlanItem, {
  as: "flightPlanItem",
  foreignKey: { name: "flightPlanItemId", allowNull: false },
});
db.flightPlanItem.hasMany(db.submission, {
  as: "submission",
});

// notificaiton to user
Notification.belongsTo(User, { foreignKey: "sentBy" });
User.hasMany(Notification, { foreignKey: "sentBy" });

export default db;
