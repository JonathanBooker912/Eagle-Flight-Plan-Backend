import task from "../controllers/task.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Role
router.post("/", [authenticate, isAdmin], task.create);

// Retrieve a single Role with id
router.get("/:id", [authenticate], task.findOne);

// Retrieve all Role
router.get("/", [authenticate], task.findAll);

// Update a Role with id
router.put("/:id", [authenticate, isAdmin], task.update);

// Delete a Role with id
router.delete("/:id", [authenticate, isAdmin], task.delete);

router.get("/types/categories", [authenticate], task.getCategories);

router.get("/types/schedulingTypes", [authenticate], task.getSchedulingTypes);

router.get("/types/taskTypes", [authenticate], task.getTaskTypes);

router.get("/types/completionTypes", [authenticate], task.getCompletionTypes);

export default router;
