import { Router } from 'express';
import { listAlerts, dismissAlert, snoozeAlert } from '../controllers/alert.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/', listAlerts);
router.put('/:id/dismiss', dismissAlert);
router.put('/:id/snooze', snoozeAlert);

export default router;
