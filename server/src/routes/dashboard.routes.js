import { Router } from 'express';
import { getDashboardStats } from '../controllers/document.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/stats', getDashboardStats);

export default router;
