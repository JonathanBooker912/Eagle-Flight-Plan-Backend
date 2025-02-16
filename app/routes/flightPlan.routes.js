import flightPlan from '../controllers/flightplan.controller.js';
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new FlightPlan
router.post("/", [authenticate, isAdmin], flightPlan.create);

// Retrieve all FlightPlans
router.get("/", [authenticate], flightPlan.findAll);

// Retrieve a single FlightPlan with id
router.get("/:id", [authenticate], flightPlan.findOne);

// Update a FlightPlan with id
router.put("/:id", [authenticate, isAdmin], flightPlan.update);

// Delete a FlightPlan with id
router.delete("/:id", [authenticate, isAdmin], flightPlan.delete);

export default router;
