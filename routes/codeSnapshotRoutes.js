import { loadCodes } from "../controllers/codeSnapShotsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

// Protected routes
router.get("/:sessionId", verifyToken, loadCodes);
export default router;
