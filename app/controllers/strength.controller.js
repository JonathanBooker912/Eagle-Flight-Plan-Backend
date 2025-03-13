import Student from "../models/student.model.js";
import Strength from "../models/strength.model.js";

const exports = {};

exports.getStrengthsForStudent = async (req, res) => {
  const studentId = req.params.id;
  
  console.log("Received request for student ID:", studentId); // Log the incoming request

  try {
    // Try fetching the student and include strengths in the response
    const student = await Student.findOne({
      where: { id: 11 },  // Find the student by ID
      include: {
        model: Strength,  // Include the related Strength model
        through: { attributes: [] }  // Exclude join table attributes (only strengths)
      }
    });

    console.log(student.strengths)

    return res.status(200).json(student.strengths);
  } catch (err) {
    console.error("Error fetching strengths for student:", studentId, err); // Log the error
    res.status(500).json({ message: "Error fetching strengths", error: err.message });
  }
};

export default exports;
