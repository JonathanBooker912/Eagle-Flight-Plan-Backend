import { Router } from "express";

import UserRoutes from "./user.routes.js";
import RoleRoutes from "./role.routes.js";
import UserRoleRoutes from "./userrole.routes.js";

const router = Router();

router.use("/user", UserRoutes);

router.use("/role", RoleRoutes);
router.use("/userrole", UserRoleRoutes);

export default router;
