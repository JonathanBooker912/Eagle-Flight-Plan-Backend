import event from "../controllers/event.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Event
router.post("/", [authenticate, isAdmin], event.create);

// Retrieve all Events
router.get("/", [authenticate], event.findAll);

// Retrieve a single Event with id
router.get("/:id", [authenticate], event.findOne);

// Retrieve a single Event with a check-in token
router.get("/token/:eventToken", [authenticate], event.findByToken);

// Update a Event with id
router.put("/:id", [authenticate, isAdmin], event.update);

// Delete a Event with id
router.delete("/:id", [authenticate, isAdmin], event.delete);

router.get(
  "/types/registrationTypes",
  [authenticate],
  event.getRegistrationTypes,
);

router.get("/types/attendanceTypes", [authenticate], event.getAttendanceTypes);

// router.get(
//     "/types/eventTypes",
//     [authenticate],
//     event.getEventTypes,
// );

router.get("/types/completionTypes", [authenticate], event.getCompletionTypes);

// Register students for an event
router.post("/:id/register", [authenticate, isAdmin], event.registerStudents);

// Mark attendance for students at an event
router.post("/:id/attend", [authenticate, isAdmin], event.markAttendance);

// Retrieve registered students for an event
router.get(
  "/:id/registered-students",
  [authenticate],
  event.getRegisteredStudents,
);

// Retrieve attending students for an event
router.get(
  "/:id/attending-students",
  [authenticate],
  event.getAttendingStudents,
);

// Get flight plan items that can be fulfilled by an event
router.get(
  "/:eventId/fulfillableFlightPlanItems/:studentId",
  [authenticate],
  event.getEventFulfillableExperiences,
);

// Generate a check-in token for an event
router.post(
  "/:eventId/check-in-token",
  [authenticate, isAdmin],
  event.generateCheckInToken,
);

// Get the current check-in token for an event
router.get(
  "/:eventId/check-in-token",
  [authenticate, isAdmin],
  event.getCheckInToken,
);

export default router;
