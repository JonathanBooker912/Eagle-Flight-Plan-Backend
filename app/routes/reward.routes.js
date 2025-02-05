import reward from "../controllers/reward.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Role
router.post("/", [authenticate, isAdmin], reward.create);

// Retrieve all Role
router.get("/", [authenticate], reward.findAll);

// Retrieve a single Role with id
router.get("/:id", [authenticate], reward.findOne);

// Retrieve all rewards earned by a student
router.get("/student/:id", [authenticate], reward.findAllRewardsForStudent);

// Update a Role with id
router.put("/:id", [authenticate, isAdmin], reward.update);

// Delete a Role with id
router.delete("/:id", [authenticate, isAdmin], reward.delete);

export default router;
