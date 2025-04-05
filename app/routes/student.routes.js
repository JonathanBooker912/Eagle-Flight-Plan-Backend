import student from "../controllers/student.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

router.get("/user/:id", [authenticate], student.findStudentForUserId);
// Create a new Student
router.post("/", [authenticate, isAdmin], student.create);

// Retrieve all People
router.get("/", [isAdmin], student.findAll);

// Retrieve a single Student with id
router.get("/:id", [authenticate, isAdmin], student.findOne);

// Update a Student with id
router.put("/:id", [authenticate, isAdmin], student.update);

// Delete a Student with id
router.delete("/:id", [authenticate, isAdmin], student.delete);

router.get(
  "/flightPlan/:id",
  [authenticate, isAdmin],
  student.findStudentForFlightPlanId,
);

router.put("/:id/points", [authenticate, isAdmin], student.updatePoints);

router.get("/:id/points", [authenticate, isAdmin], student.getPoints);

router.get("/:id", [authenticate, isAdmin], student.getStudent);
export default router;
