import student from "../controllers/student.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

router.get("/user/:id", [authenticate], student.findStudentForUserId);

export default router;
