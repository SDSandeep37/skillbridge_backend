import express from 'express';
import { createUserControllder, loginController, userLoginCheck,  } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post('/',createUserControllder);
router.post('/login',loginController);

// Protected routes
router.post('/login-check', verifyToken, userLoginCheck);

export default router;