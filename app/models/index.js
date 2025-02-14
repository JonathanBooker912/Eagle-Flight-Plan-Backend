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

// BADGEFULFILL
Badge.belongsToMany(Student, { through: db.badgeFulfill });
Student.belongsToMany(Badge, { through: db.badgeFulfill });

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

/// Flight Plan to Semester
db.flightPlan.hasOne(db.semester, {
  as: "semester",
  foreignKey: { name: "id", allowNull: false },
});
db.semester.hasMany(db.flightPlan);

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
db.flightPlanItem.hasOne(db.task, {
  as: "task",
  foreignKey: { name: "id", allowNull: true },
});
db.task.hasMany(db.flightPlanItem);

// Flight plan to Event
db.flightPlanItem.hasOne(db.event, {
  as: "event",
  foreignKey: { name: "id", allowNull: true },
});
db.event.hasMany(db.flightPlanItem);

// Flight plan to Experience
db.flightPlanItem.hasOne(db.experience, {
  as: "experience",
  foreignKey: { name: "id", allowNull: true },
});
db.experience.hasMany(db.flightPlanItem);

// Validation function
const validateFlightPlanItem = (flightPlanItem) => {
  const hasTask = flightPlanItem.taskId !== undefined && flightPlanItem.taskId !== null;
  const hasEvent = flightPlanItem.eventId !== undefined && flightPlanItem.eventId !== null;
  const hasExperience = flightPlanItem.experienceId !== undefined && flightPlanItem.experienceId !== null;
  const hasFlightPlan = flightPlanItem.flightPlanId !== undefined && flightPlanItem.flightPlanId !== null;


  if (!hasFlightPlan){
    throw new Error("A FlightPlanItem must have a flight plan");
  }

  if (!hasTask && !hasExperience && !hasEvent) {
    return; // No validation
  }

  // Validation logic
  if (!hasTask && !hasExperience) {
    throw new Error('A FlightPlanItem must have either a taskId or an experienceId.');
  }

  if (hasTask && hasEvent) {
    throw new Error('A FlightPlanItem with a taskId cannot have an eventId.');
  }
};

// Add validation hooks
FlightPlanItem.addHook('beforeValidate', (flightPlanItem) => {
  validateFlightPlanItem(flightPlanItem);
});

export default db;
