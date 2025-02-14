import { Router } from "express";

import AuthRoutes from "./auth.routes.js";
import UserRoutes from "./user.routes.js";
import RoleRoutes from "./role.routes.js";
import UserRoleRoutes from "./userrole.routes.js";
import RewardRoutes from "./reward.routes.js";
import NotificationRoutes from "./notification.routes.js";
import BadgeRoutes from "./badge.routes.js";
import ExperienceRoutes from "./experience.routes.js";
import EventRoutes from "./event.routes.js";
import TaskRoutes from "./task.routes.js";

const router = Router();

router.use("/", AuthRoutes);
router.use("/user", UserRoutes);

router.use("/role", RoleRoutes);
router.use("/userrole", UserRoleRoutes);
router.use("/reward", RewardRoutes);
router.use("/notification", NotificationRoutes);
router.use("/badge", BadgeRoutes);
router.use("/experience", ExperienceRoutes);
router.use("/event", EventRoutes);
router.use("/task", TaskRoutes);


// eslint-disable-next-line
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Team 1's Eagle Flight Plan API." });
});

export default router;
