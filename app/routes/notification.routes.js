import notification from "../controllers/notification.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Notification
router.post("/", [authenticate, isAdmin], notification.create);

// Retrieve all Notification
router.get("/", [authenticate], notification.findAll);

// Retrieve a single Notification with id
router.get("/:id", [authenticate], notification.findOne);

// Retrieve all notifications for a user
router.get(
  "/user/:id",
  [authenticate],
  notification.findAllNotificationsForUser,
);

// Update a Notification with id
router.put("/:id", [authenticate, isAdmin], notification.update);

// Delete a Notification with id
router.delete("/:id", [authenticate, isAdmin], notification.delete);

export default router;
