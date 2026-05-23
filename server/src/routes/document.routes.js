import { Router } from 'express';
import {
  listDocuments,
  uploadDocument,
  getDocument,
  deleteDocument,
  getDocumentStatus,
} from '../controllers/document.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

// All document routes require authentication
router.use(protect);

router.get('/', listDocuments);
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);
router.get('/:id/status', getDocumentStatus);

export default router;
