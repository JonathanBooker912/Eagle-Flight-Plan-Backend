import Student from "../models/student.model.js";
import Strength from "../models/strength.model.js";

const exports = {};

exports.getStrengthsForStudent = async (req, res) => {
  const studentId = req.params.id;
  
  console.log("Received request for student ID:", studentId); // Log the incoming request

  try {
    // Try fetching the student and include strengths in the response
    const student = await Student.findOne({
      where: { id: 1 },  // Find the student by ID
      include: {
        model: Strength,  // Include the related Strength model
        through: { attributes: [] }  // Exclude join table attributes (only strengths)
      }
    });


    // Check if student is found
    if (!student) {
      console.log("Student not found for ID:", studentId); // Log if student is not found
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if strengths are found
    console.log("Student found:", student); // Log the student object for debugging
    console.log("Strengths associated with student:", student.Strengths); // Log strengths

    // If no strengths found, return an empty array
    if (!student.Strengths || student.Strengths.length === 0) {
      console.log("No strengths found for student:", studentId); // Log if no strengths
      return res.status(200).json([]);  // Return empty array if no strengths
    }

    // Return the strengths if found
    console.log("Returning strengths for student:", studentId); // Log before returning
    return res.status(200).json(student.Strengths);
  } catch (err) {
    console.error("Error fetching strengths for student:", studentId, err); // Log the error
    res.status(500).json({ message: "Error fetching strengths", error: err.message });
  }
};

export default exports;
