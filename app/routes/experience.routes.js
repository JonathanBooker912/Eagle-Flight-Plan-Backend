import experience from "../controllers/experience.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Experience
router.post("/", [authenticate, isAdmin], experience.create);

// Retrieve all Experience
router.get("/", [authenticate], experience.findAll);

// Retrieve a single Experience with id
router.get("/:id", [authenticate], experience.findOne);

// Update a Experience with id
router.put("/:id", [authenticate, isAdmin], experience.update);

// Delete a Experience with id
router.delete("/:id", [authenticate, isAdmin], experience.delete);

export default router;
