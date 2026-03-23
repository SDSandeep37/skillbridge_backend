import {
  createUserControllder,
  getUserRoleStudent,
  loginController,
  userLoginCheck,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

// Public routes
router.post("/", createUserControllder);
router.post("/login", loginController);

// Protected routes
router.post("/login-check", verifyToken, userLoginCheck);
router.get("/students", verifyToken, getUserRoleStudent);
export default router;
