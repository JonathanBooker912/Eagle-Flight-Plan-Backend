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

// Route to get badges for a student
router.get("/student/:id", [authenticate], badge.getBadgesForStudent);

// Delete a Role with id
router.delete("/:id", [authenticate, isAdmin], badge.delete);

router.post("/upload", [authenticate, isAdmin], badge.uploadImage);

router.get("/image/:fileName", [authenticate, isAdmin], badge.getImageForName);
// Delete a Badge with id
router.delete("/:id", [authenticate, isAdmin], badge.delete);

router.delete(
  "/image/:fileName",
  [authenticate, isAdmin],
  badge.deleteBadgeImage,
);

export default router;
