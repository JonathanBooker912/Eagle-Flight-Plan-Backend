import { Router } from "express";

import UserRoutes from "./user.routes.js";
import RoleRoutes from "./role.routes.js";
import UserRoleRoutes from "./userrole.routes.js";

const router = Router();

router.use("/user", UserRoutes);

router.use("/role", RoleRoutes);
router.use("/userrole", UserRoleRoutes);

// eslint-disable-next-line
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Team 1's Eagle Flight Plan API." });
});

export default router;
