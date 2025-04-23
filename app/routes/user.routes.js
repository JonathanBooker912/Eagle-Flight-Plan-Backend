import user from "../controllers/user.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new User
router.post("/", [authenticate], user.create);

// Retrieve all People
router.get("/", user.findAll);

router.get("/admin", [authenticate, isAdmin], user.findAllForAdmin);

router.get("/admin/all", [authenticate], user.findAllAdmins);

// Retrieve a single User with id
router.get("/:id", [authenticate], user.findOne);

// Retrieve a single User with email
router.get("/email/:email", [authenticate], user.findByEmail);

// Update a User with id
router.put("/:id", [authenticate], user.update);

// Delete a User with id
router.delete("/:id", [authenticate, isAdmin], user.delete);

export default router;
