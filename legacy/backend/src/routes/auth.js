import express from 'express';
import {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.get('/me', authenticate, getMe);

export default router;


