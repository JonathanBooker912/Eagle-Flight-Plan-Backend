import flightPlanItem from "../controllers/flightPlanItem.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new FlightPlanItem
router.post("/", [authenticate, isAdmin], flightPlanItem.create);

// Retrieve all FlightPlanItems
router.get("/", [authenticate], flightPlanItem.findAll);

// Retrieve a single FlightPlanItem with id
router.get("/:id", [authenticate], flightPlanItem.findOne);

// Retrieve FlightPlanItems by FlightPlan ID
router.get(
  "/flightplan/:flightPlanId",
  [authenticate],
  flightPlanItem.findAllFlightPlanItemsByFlightPlanId,
);

// Update a FlightPlanItem with id
router.put("/:id", [authenticate, isAdmin], flightPlanItem.update);

// Delete a FlightPlanItem with id
router.delete("/:id", [authenticate, isAdmin], flightPlanItem.delete);

export default router;
