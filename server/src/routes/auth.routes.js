import { Router } from 'express';
import { z } from 'zod';
import { register, login, logout, refresh } from '../controllers/auth.controller.js';
import validate from '../middleware/validate.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);

export default router;
