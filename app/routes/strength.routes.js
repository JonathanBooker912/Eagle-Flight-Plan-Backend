import strengths from "../controllers/strength.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Retrieve all strengths
router.get("/", [authenticate], strengths.findAll);

export default router;
