import badge from "../controllers/badge.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Role
router.post("/", [authenticate, isAdmin], badge.create);

// Retrieve all Role
router.get("/", [authenticate], badge.findAll);

// Retrieve a single Role with id
router.get("/:id", [authenticate], badge.findOne);

// Update a Role with id
router.put("/:id", [authenticate, isAdmin], badge.update);

// Delete a Role with id
router.delete("/:id", [authenticate, isAdmin], badge.delete);

export default router;
