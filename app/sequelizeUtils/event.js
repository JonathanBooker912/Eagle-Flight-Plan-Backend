import db from "../models/index.js";
import { Op } from "sequelize";
const Event = db.event;
const Strength = db.strength;
const EventStudents = db.eventStudents;

const exports = {};

exports.findAllEvents = async (
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

  if (searchQuery) {
    whereCondition.name = { [Op.like]: `%${searchQuery}%` };
  }

  if (filters.startDate) {
    whereCondition.date = { [Op.gte]: new Date(filters.startDate) };
  }

  if (filters.endDate) {
    whereCondition.date = {
      ...whereCondition.date,
      [Op.lte]: new Date(filters.endDate),
    };
  }

  if (filters.location) {
    whereCondition.location = { [Op.like]: `%${filters.location}%` };
  }

  let order = [];

  if (filters.sortAttribute && filters.sortDirection) {
    // Default to ascending order if direction is not provided
    const direction =
      filters.sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    order = [[filters.sortAttribute, direction]];
  }

  const queryOptions = {
    offset,
    limit,
    where: whereCondition,
    include: [],
    order,
  };

  console.log(filters.strengths);

  if (filters.strengths && filters.strengths.length > 0) {
    queryOptions.include.push({
      model: Strength,
      where: { id: { [Op.in]: filters.strengths.map(Number) } },
      required: true, // Ensures only events with matching strengths are included
    });
  }

  const events = await Event.findAll(queryOptions);

  const count = await Event.count({
    where: whereCondition, // Apply the search condition to the count as well
  });

  const totalPages = Math.ceil(count / pageSize);

  return { events, count: totalPages };
};

exports.findOneEvent = async (eventId) => {
  return await Event.findByPk(eventId);
};

exports.createEvent = async (eventData) => {
  return await Event.create(eventData);
};

exports.updateEvent = async (eventData, eventId) => {
  return await Event.update(eventData, { where: { id: eventId } });
};

exports.deleteEvent = async (eventId) => {
  return await Event.destroy({ where: { id: eventId } });
};

exports.getRegistrationTypes = () => {
  return Event.getAttributes().registration.values;
};

exports.getAttendanceTypes = () => {
  return Event.getAttributes().attendanceType.values;
};

// exports.getEventTypes = () => {
//   return Event.getAttributes().attendanceType.values;
// };

exports.getCompletionTypes = () => {
  return Event.getAttributes().completionType.values;
};

// Method to register students for an event
exports.registerStudents = async (eventId, studentIds) => {
  const registrations = studentIds.map(studentId => ({
    eventId,
    studentId,
    attended: false,
    recordedTime: null,
  }));
  return await EventStudents.bulkCreate(registrations);
};

// In your backend, modify the markAttendance function to toggle the attendance status
exports.markAttendance = async (eventId, studentIds) => {
  try {
    for (const studentId of studentIds) {
      const eventStudent = await EventStudents.findOne({ 
        where: { eventId, studentId },
      });

      if (eventStudent) {
        // Toggle attendance status
        eventStudent.attended = !eventStudent.attended;
        await eventStudent.save();
      }

      if (eventStudent.attended) {
        eventStudent.recordedTime = Date.now();
        await eventStudent.save();
      }
      else {
        eventStudent.recordedTime = null;
        await eventStudent.save();
      }

      console.log("Date for eventStudent:");
      console.log(Date.now());
      console.log(eventStudent.recordedTime);

      
    }

    return { message: "Attendance updated successfully." };
  } catch (error) {
    console.error("Error marking attendance:", error);
    throw new Error("Error marking attendance.");
  }
};


// Method to fetch students registered for an event
exports.getRegisteredStudents = async (eventId) => {
  try {
    console.log(`Fetching registered students for event ID: ${eventId}`);

    const students = await EventStudents.findAll({
      where: { eventId },
      include: [
        {
          model: db.student,
          include: [{ model: db.user, as: "user" }], // Include user data
        },
      ],
      raw: true, // Raw true will make Sequelize return a plain object (avoids circular reference)
    });

    // Transform the data to remove circular references and return a cleaner structure
    const studentsWithAttendanceStatus = students.map((eventStudent) => ({
      id: eventStudent.id,
      studentId: eventStudent.studentId,
      attendedStatus: eventStudent.attended, 
      recordedTime: eventStudent.recordedTime,
      user: {
        id: eventStudent["student.user.id"],
        fName: eventStudent["student.user.fName"],
        lName: eventStudent["student.user.lName"],
        fullName: eventStudent["student.user.fullName"],
        email: eventStudent["student.user.email"],
      },
    }));

    console.log(`Registered students found: ${JSON.stringify(studentsWithAttendanceStatus)}`);
    return studentsWithAttendanceStatus;
  } catch (error) {
    console.error("Error fetching registered students:", error);
    throw new Error("Error retrieving registered students.");
  }
};

// Method to fetch attending students for an event
exports.getAttendingStudents = async (eventId) => {
  try {
    const students = await EventStudents.findAll({
      where: { eventId, attended: true },
      include: [
        {
          model: db.student,
          include: [{ model: db.user, as: "user" }], // Include user data
        },
      ],
    });
    return students;
  } catch (error) {
    console.error("Error fetching attending students:", error);
    throw new Error("Error retrieving attending students.");
  }
};
export default exports;
