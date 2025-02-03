import user from "../controllers/user.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new User
router.post("/", [authenticate], user.create);

// Retrieve all People
router.get("/", user.findAll);

// Retrieve a single User with id
router.get("/:id", [authenticate], user.findOne);

// Update a User with id
router.put("/:id", [authenticate], user.update);

// Delete a User with id
router.delete("/:id", [authenticate], user.delete);

export default router;
