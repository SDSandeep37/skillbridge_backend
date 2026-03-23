import {
  createSessionContoller,
  mentorSessionsContoller,
  studentSessionJoinContoller,
  studentSessionsContoller,
  updateSessionMentorEndingController,
} from "../controllers/sessionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

router.post("/", verifyToken, createSessionContoller);
router.get("/student", verifyToken, studentSessionsContoller);
router.get("/mentor", verifyToken, mentorSessionsContoller);
router.put("/join-session/:id", verifyToken, studentSessionJoinContoller);
router.put(
  "/end-session/:id",
  verifyToken,
  updateSessionMentorEndingController,
);

export default router;
