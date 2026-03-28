import { loadMessages } from "../controllers/messagesController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

// Protected routes
router.get("/:sessionId", verifyToken, loadMessages);
export default router;
