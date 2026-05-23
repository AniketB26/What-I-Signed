import crypto from 'crypto';
import Document from '../models/Document.js';
import Chunk from '../models/Chunk.js';
import Alert from '../models/Alert.js';
import { extractFromPdf } from '../services/extraction/pdf.extractor.js';
import { extractWithOCR } from '../services/extraction/ocr.extractor.js';
import { extractFromDocx } from '../services/extraction/docx.extractor.js';
import { chunkText } from '../services/chunking/chunker.service.js';
import { generateEmbeddings } from '../services/ai/embedding.service.js';
import { upsertVectors } from '../services/vector/pinecone.service.js';
import { extractClauses } from '../services/clause/clause.extractor.js';
import logger from '../utils/logger.js';

/**
 * Download file from URL and return as buffer.
 * @param {string} url - File URL
 * @returns {Promise<Buffer>}
 */
const downloadFile = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

/**
 * Update document status and progress.
 * @param {string} docId
 * @param {string} status
 * @param {number} progress
 */
const updateProgress = async (docId, status, progress) => {
  await Document.findByIdAndUpdate(docId, {
    status,
    processingProgress: progress,
  });
  logger.info(`Document ${docId}: ${status} (${progress}%)`);
};

/**
 * Create alerts from extracted clause data.
 * @param {object} clauses - Extracted clauses
 * @param {string} documentId
 * @param {string} userId
 * @param {string} docName
 */
const createAlerts = async (clauses, documentId, userId, docName) => {
  const alerts = [];

  // Expiry alert
  if (clauses.endDate) {
    alerts.push({
      userId,
      documentId,
      alertType: 'expiry',
      message: `"${docName}" expires on ${new Date(clauses.endDate).toLocaleDateString()}`,
      severity: 'warning',
      dueDate: new Date(clauses.endDate),
    });
  }

  // Auto-renewal alert
  if (clauses.autoRenewal && clauses.endDate) {
    const noticeDate = new Date(clauses.endDate);
    noticeDate.setDate(noticeDate.getDate() - 30);
    alerts.push({
      userId,
      documentId,
      alertType: 'renewal',
      message: `"${docName}" has auto-renewal. Review before ${noticeDate.toLocaleDateString()}`,
      severity: 'warning',
      dueDate: noticeDate,
    });
  }

  // Notice period deadline
  if (clauses.noticePeriod && clauses.endDate) {
    const noticeDays = parseInt(clauses.noticePeriod) || 30;
    const noticeDeadline = new Date(clauses.endDate);
    noticeDeadline.setDate(noticeDeadline.getDate() - noticeDays);
    alerts.push({
      userId,
      documentId,
      alertType: 'notice_deadline',
      message: `Notice period deadline for "${docName}": ${noticeDeadline.toLocaleDateString()}`,
      severity: 'critical',
      dueDate: noticeDeadline,
    });
  }

  // Red flag alerts
  if (clauses.redFlags && clauses.redFlags.length > 0) {
    for (const flag of clauses.redFlags) {
      if (flag.severity === 'high') {
        alerts.push({
          userId,
          documentId,
          alertType: 'red_flag',
          message: `Red flag in "${docName}": ${flag.explanation || flag.clause}`,
          severity: 'critical',
          dueDate: new Date(),
        });
      }
    }
  }

  if (alerts.length > 0) {
    await Alert.insertMany(alerts);
    logger.info(`Created ${alerts.length} alerts for document ${documentId}`);
  }
};

/**
 * Define the 'process-document' job on the Agenda instance.
 * @param {import('agenda').Agenda} agenda - Agenda instance
 */
export const defineDocumentJob = (agenda) => {
  agenda.define('process-document', async (job) => {
    const { documentId } = job.attrs.data;

    let doc;
    try {
      doc = await Document.findById(documentId);
      if (!doc) {
        throw new Error(`Document ${documentId} not found`);
      }

      // Step 1: Download file
      await updateProgress(documentId, 'extracting', 5);
      const buffer = await downloadFile(doc.fileUrl);
      await updateProgress(documentId, 'extracting', 15);

      // Step 2: Extract text based on file type
      let extractionResult;
      switch (doc.fileType) {
        case 'pdf':
          extractionResult = await extractFromPdf(buffer);
          break;
        case 'image':
          extractionResult = await extractWithOCR(buffer);
          break;
        case 'docx':
          extractionResult = await extractFromDocx(buffer);
          break;
        default:
          throw new Error(`Unsupported file type: ${doc.fileType}`);
      }

      const { text: rawText, pageCount } = extractionResult;

      if (!rawText || rawText.trim().length === 0) {
        throw new Error('No text could be extracted from the document');
      }

      await updateProgress(documentId, 'extracting', 30);

      // Step 3: Hash check for duplicate detection
      const rawTextHash = crypto.createHash('sha256').update(rawText).digest('hex');
      await Document.findByIdAndUpdate(documentId, { rawTextHash, pageCount });

      // Step 4: Chunk text
      await updateProgress(documentId, 'chunking', 40);
      const chunks = await chunkText(rawText, pageCount);

      if (chunks.length === 0) {
        throw new Error('Document produced zero chunks after text splitting');
      }

      await updateProgress(documentId, 'chunking', 50);

      // Step 5: Generate embeddings
      await updateProgress(documentId, 'embedding', 55);
      const chunkTexts = chunks.map((c) => c.text);
      const embeddings = await generateEmbeddings(chunkTexts);
      await updateProgress(documentId, 'embedding', 70);

      // Step 6: Upsert vectors to Pinecone
      const vectorIds = await upsertVectors(chunks, embeddings, {
        documentId: doc._id.toString(),
        userId: doc.userId.toString(),
        docType: doc.docType || 'other',
        docName: doc.originalName,
      });
      await updateProgress(documentId, 'embedding', 75);

      // Step 7: Save chunks to MongoDB
      const chunkDocs = chunks.map((chunk, idx) => ({
        documentId: doc._id,
        userId: doc.userId,
        text: chunk.text,
        pineconeId: vectorIds[idx],
        metadata: {
          docName: doc.originalName,
          docType: doc.docType || 'other',
          pageNumber: chunk.metadata.pageNumber,
          chunkIndex: chunk.metadata.chunkIndex,
        },
      }));

      await Chunk.insertMany(chunkDocs);
      await updateProgress(documentId, 'analyzing', 80);

      // Step 8: Clause extraction via LLM
      const clauseResult = await extractClauses(rawText);
      const { docType, summary, ...extractedClauses } = clauseResult;

      await updateProgress(documentId, 'analyzing', 90);

      // Step 9: Create alerts from extracted clauses
      await createAlerts(extractedClauses, doc._id, doc.userId, doc.originalName);

      // Step 10: Mark document as ready
      await Document.findByIdAndUpdate(documentId, {
        status: 'ready',
        processingProgress: 100,
        docType: docType || doc.docType || 'other',
        summary: summary || '',
        extractedClauses,
        chunkCount: chunks.length,
        processedAt: new Date(),
      });

      // Update user doc count
      const User = (await import('../models/User.js')).default;
      await User.findByIdAndUpdate(doc.userId, { $inc: { docCount: 1 } });

      logger.info(`Document ${documentId} processing complete`, {
        chunks: chunks.length,
        docType,
      });
    } catch (error) {
      logger.error(`Document processing failed: ${error.message}`, {
        documentId,
        stack: error.stack,
      });

      await Document.findByIdAndUpdate(documentId, {
        status: 'failed',
        errorMessage: error.message,
      }).catch(() => {});
    }
  });
};
