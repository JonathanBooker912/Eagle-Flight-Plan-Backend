import flightPlanItem from "../controllers/flightPlanItem.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new FlightPlanItem
router.post("/", [authenticate, isAdmin], flightPlanItem.create);

router.post(
  "/submit/:flightPlanItemId",
  [authenticate],
  flightPlanItem.createSubmission,
);

// Retrieve all FlightPlanItems
router.get("/", [authenticate], flightPlanItem.findAll);

// Retrieve FlightPlanItems by FlightPlan ID
router.get(
  "/flightplan/:flightPlanId",
  [authenticate],
  flightPlanItem.findAllFlightPlanItemsByFlightPlanId,
);

router.get("/types", [authenticate], flightPlanItem.getFlightPlanItemTypes);

router.get(
  "/statuses",
  [authenticate],
  flightPlanItem.getFlightPlanItemStatuses,
);

// Update a FlightPlanItem with id
router.put("/:id", [authenticate, isAdmin], flightPlanItem.update);

// Delete a FlightPlanItem with id
router.delete("/:id", [authenticate, isAdmin], flightPlanItem.delete);

export default router;
