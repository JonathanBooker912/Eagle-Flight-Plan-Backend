// EventStudents.model.js
import { Sequelize } from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";
import Student from "./student.model.js"; // Import the Student model
import Event from "./event.model.js"; // Import the Event model

const EventStudents = SequelizeInstance.define("EventStudents", {
  eventId: {
    type: Sequelize.INTEGER,
    references: {
      model: "events",
      key: "id",
    },
  },
  studentId: {
    type: Sequelize.INTEGER,
    references: {
      model: "students", 
      key: "id",
    },
  },
  attended: {
    type: Sequelize.BOOLEAN,
    defaultValue: false, 
  },
});


// Export the model
export default EventStudents;