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

// Update a Event with id
router.put("/:id", [authenticate, isAdmin], event.update);

// Delete a Event with id
router.delete("/:id", [authenticate, isAdmin], event.delete);

export default router;
