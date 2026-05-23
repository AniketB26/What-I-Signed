import Document from '../models/Document.js';
import Chunk from '../models/Chunk.js';
import Alert from '../models/Alert.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/storage/cloudinary.service.js';
import { deleteVectorsByDocument } from '../services/vector/pinecone.service.js';
import agenda from '../config/agenda.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

/**
 * Map MIME type to file type enum.
 * @param {string} mimeType
 * @returns {string}
 */
const getFileType = (mimeType) => {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('wordprocessingml')) return 'docx';
  return 'pdf';
};

/**
 * @route   GET /api/documents
 * @desc    List user's documents (paginated with filters)
 * @access  Private
 */
export const listDocuments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    page = 1,
    limit = 10,
    docType,
    status,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  const filter = { userId };
  if (docType) filter.docType = docType;
  if (status) filter.status = status;

  const [documents, total] = await Promise.all([
    Document.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select('-extractedClauses')
      .lean(),
    Document.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      documents,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    },
    message: 'Documents retrieved',
  });
});

/**
 * @route   POST /api/documents/upload
 * @desc    Upload a document, store in Cloudinary, queue processing
 * @access  Private
 */
export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'No file provided',
    });
  }

  const userId = req.user._id;
  const { buffer, originalname, mimetype, size } = req.file;

  // Upload to Cloudinary
  const { url, publicId } = await uploadToCloudinary(buffer, originalname, userId.toString());

  // Create document record
  const doc = await Document.create({
    userId,
    originalName: originalname,
    fileUrl: url,
    filePublicId: publicId,
    fileType: getFileType(mimetype),
    mimeType: mimetype,
    fileSize: size,
    status: 'queued',
  });

  // Queue processing job
  await agenda.schedule('in 2 seconds', 'process-document', {
    documentId: doc._id.toString(),
  });

  logger.info('Document uploaded and queued', {
    documentId: doc._id,
    userId,
    originalName: originalname,
  });

  res.status(201).json({
    success: true,
    data: {
      documentId: doc._id,
      status: doc.status,
    },
    message: 'Document uploaded and queued for processing',
  });
});

/**
 * @route   GET /api/documents/:id
 * @desc    Get single document with all clauses
 * @access  Private
 */
export const getDocument = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const doc = await Document.findOne({ _id: req.params.id, userId }).lean();

  if (!doc) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Document not found',
    });
  }

  res.json({
    success: true,
    data: { document: doc },
    message: 'Document retrieved',
  });
});

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete document and all related data
 * @access  Private
 */
export const deleteDocument = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const doc = await Document.findOne({ _id: req.params.id, userId });

  if (!doc) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Document not found',
    });
  }

  // Delete in parallel: Cloudinary file, Pinecone vectors, MongoDB chunks, alerts
  await Promise.all([
    deleteFromCloudinary(doc.filePublicId).catch((err) =>
      logger.warn('Cloudinary delete failed during document deletion', { error: err.message })
    ),
    deleteVectorsByDocument(doc._id.toString()).catch((err) =>
      logger.warn('Pinecone delete failed during document deletion', { error: err.message })
    ),
    Chunk.deleteMany({ documentId: doc._id, userId }),
    Alert.deleteMany({ documentId: doc._id, userId }),
  ]);

  await Document.findByIdAndDelete(doc._id);

  // Decrement user doc count
  const User = (await import('../models/User.js')).default;
  await User.findByIdAndUpdate(userId, { $inc: { docCount: -1 } });

  logger.info('Document deleted', { documentId: doc._id, userId });

  res.json({
    success: true,
    data: null,
    message: 'Document and all related data deleted',
  });
});

/**
 * @route   GET /api/documents/:id/status
 * @desc    SSE stream for document processing status
 * @access  Private
 */
export const getDocumentStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Verify ownership
  const doc = await Document.findOne({ _id: req.params.id, userId }).lean();
  if (!doc) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Document not found',
    });
  }

  // Set up SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Poll every 2 seconds
  const interval = setInterval(async () => {
    try {
      const currentDoc = await Document.findOne({ _id: req.params.id, userId })
        .select('status processingProgress errorMessage')
        .lean();

      if (!currentDoc) {
        sendEvent({ status: 'failed', progress: 0, error: 'Document not found' });
        clearInterval(interval);
        res.end();
        return;
      }

      sendEvent({
        status: currentDoc.status,
        progress: currentDoc.processingProgress,
        error: currentDoc.errorMessage || null,
      });

      // Close connection on terminal states
      if (currentDoc.status === 'ready' || currentDoc.status === 'failed') {
        clearInterval(interval);
        res.end();
      }
    } catch (error) {
      logger.error('SSE status poll error', { error: error.message });
      sendEvent({ status: 'failed', progress: 0, error: 'Internal error' });
      clearInterval(interval);
      res.end();
    }
  }, 2000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
  });
});

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get user's dashboard statistics
 * @access  Private
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalDocs, activeAlerts, docsByType] = await Promise.all([
    Document.countDocuments({ userId }),
    Alert.countDocuments({ userId, fired: false, dismissed: false }),
    Document.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$docType',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const docsByTypeMap = {};
  for (const item of docsByType) {
    docsByTypeMap[item._id || 'unclassified'] = item.count;
  }

  res.json({
    success: true,
    data: {
      totalDocs,
      activeAlerts,
      docsByType: docsByTypeMap,
    },
    message: 'Dashboard stats retrieved',
  });
});
