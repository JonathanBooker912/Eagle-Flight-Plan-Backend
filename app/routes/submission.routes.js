import submission from "../controllers/submission.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

router.post("/", [authenticate], submission.create);

export default router;
