import link from "../controllers/link.controller.js";
import { Router } from "express";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

// Retrieve all notifications for a user
router.get("/user/:id", link.findAllLinksForStudent);

// Create a new link
router.post("/", [authenticate], link.create);

// Update a link
router.put("/:id", [authenticate], link.update);

// Delete a link
router.delete("/:id", [authenticate], link.delete);

export default router;
