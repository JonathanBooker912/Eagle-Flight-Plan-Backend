import Event from "../sequelizeUtils/event.js";

const exports = {};

exports.create = async (req, res) => {
  await Event.createEvent(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the event.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Event.findOneEvent(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find event with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving event with id = " + req.params.id,
      });
      console.log("Could not find event: " + err);
    });
};

exports.findAll = async (req, res) => {
  const {
    page,
    pageSize,
    searchQuery,
    startDate,
    endDate,
    location,
    strengths,
    sortAttribute,
    sortDirection,
  } = req.query;
  await Event.findAllEvents(page, pageSize, searchQuery, {
    startDate,
    endDate,
    location,
    strengths,
    sortAttribute,
    sortDirection,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};

exports.update = async (req, res) => {
  await Event.updateEvent(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Event was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update event with id = ${req.params.id}. Maybe event was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating event with id = " + req.params.id,
      });
      console.log("Could not update event: " + err);
    });
};

exports.delete = async (req, res) => {
  await Event.deleteEvent(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Event was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete event with id = ${req.params.id}. Maybe event was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete event with id = " + req.params.id,
      });
      console.log("Could not delete event: " + err);
    });
};

exports.getRegistrationTypes = (req, res) => {
  res.send(Event.getRegistrationTypes());
};

exports.getAttendanceTypes = (req, res) => {
  res.send(Event.getAttendanceTypes());
};

// exports.getEventTypes = (req, res) => {
//   res.send(Event.getEventTypes());
// };

exports.getCompletionTypes = (req, res) => {
  res.send(Event.getCompletionTypes());
};

exports.registerStudents = async (req, res) => {
  const eventId = req.params.id;
  const { studentIds } = req.body;
  console.log(eventId);
  console.log(studentIds);
  try {
    const data = await Event.registerStudents(eventId, studentIds);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while registering students.",
    });
  }
};

exports.markAttendance = async (req, res) => {
  const eventId = req.params.id;
  const studentIds = req.body.studentIds;

  if (!eventId || !Array.isArray(studentIds) || studentIds.length === 0) {
    console.error("Invalid payload received:", req.body);
    return res.status(400).send({ message: "Invalid eventId or studentIds." });
  }

  try {
    console.log(
      `Marking attendance for eventId: ${eventId}, studentIds:`,
      studentIds,
    );

    const data = await Event.markAttendance(eventId, studentIds);
    console.log("Database update result:", data);
    res.send(data);
  } catch (err) {
    console.error("Error marking attendance:", err);
    res
      .status(500)
      .send({ message: "Error marking attendance.", error: err.message });
  }
};

exports.getRegisteredStudents = async (req, res) => {
  const eventId = req.params.id; // Get event ID from request params
  try {
    const students = await Event.getRegisteredStudents(eventId);
    res.send(students);
  } catch (err) {
    console.error("Error retrieving registered students:", err);
    res.status(500).send({
      message: "Error retrieving registered students.",
      error: err.message, // Include error message for debugging
    });
  }
};

exports.getAttendingStudents = async (req, res) => {
  const eventId = req.params.id; // Get event ID from request params
  try {
    const students = await Event.getAttendingStudents(eventId);
    res.send(students);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving attending students.",
    });
  }
};

export default exports;
