import { Router } from 'express';
import { z } from 'zod';
import { queryDocuments, compareDocs } from '../controllers/query.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { queryLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

const querySchema = z.object({
  question: z.string().min(3, 'Question must be at least 3 characters').max(1000),
  filters: z
    .object({
      documentId: z.string().optional(),
      docType: z.string().optional(),
    })
    .optional(),
});

const compareSchema = z.object({
  docIdA: z.string().min(1, 'Document A ID is required'),
  docIdB: z.string().min(1, 'Document B ID is required'),
  topic: z.string().min(3, 'Topic must be at least 3 characters').max(500),
});

router.use(protect);

router.post('/', queryLimiter, validate(querySchema), queryDocuments);
router.post('/compare', queryLimiter, validate(compareSchema), compareDocs);

export default router;
