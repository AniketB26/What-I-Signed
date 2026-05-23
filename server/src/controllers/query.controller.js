import { generateSingleEmbedding } from '../services/ai/embedding.service.js';
import { retrieveRelevantChunks } from '../services/rag/retriever.service.js';
import { rerankChunks } from '../services/rag/reranker.service.js';
import { streamAnswer } from '../services/rag/answerer.service.js';
import { compareDocuments } from '../services/rag/comparator.service.js';
import Document from '../models/Document.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

/**
 * @route   POST /api/query
 * @desc    Query documents — embed → retrieve → rerank → stream answer via SSE
 * @access  Private
 */
export const queryDocuments = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const { question, filters = {} } = req.body;

  // Set up SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // Step 1: Embed the question
    sendEvent('status', { step: 'embedding', message: 'Understanding your question...' });
    const queryEmbedding = await generateSingleEmbedding(question);

    // Step 2: Retrieve relevant chunks
    sendEvent('status', { step: 'retrieving', message: 'Searching your documents...' });
    const chunks = await retrieveRelevantChunks(queryEmbedding, userId, filters, 10);

    if (chunks.length === 0) {
      sendEvent('answer', { text: 'I could not find any relevant information in your documents to answer this question.' });
      sendEvent('done', { chunksUsed: 0 });
      res.end();
      return;
    }

    // Step 3: Rerank chunks
    sendEvent('status', { step: 'analyzing', message: 'Analyzing relevance...' });
    const rankedChunks = await rerankChunks(question, chunks);

    // Step 4: Stream the answer
    sendEvent('status', { step: 'generating', message: 'Generating answer...' });

    const answerStream = streamAnswer(question, rankedChunks);
    for await (const textChunk of answerStream) {
      sendEvent('answer', { text: textChunk });
    }

    // Send sources info
    const sources = rankedChunks.map((c) => ({
      documentName: c.metadata?.docName || 'Unknown',
      documentId: c.metadata?.documentId || null,
      page: c.metadata?.pageNumber,
      relevance: c.relevanceScore,
      excerpt: c.text ? c.text.substring(0, 200) : '',
    }));

    sendEvent('sources', { sources });
    sendEvent('done', { chunksUsed: rankedChunks.length });

    logger.info('Query answered', { userId, question: question.substring(0, 100), chunksUsed: rankedChunks.length });
  } catch (error) {
    logger.error('Query failed', { error: error.message, userId });
    sendEvent('error', { message: 'An error occurred while processing your question.' });
  }

  res.end();
});

/**
 * @route   POST /api/query/compare
 * @desc    Compare two documents on a topic
 * @access  Private
 */
export const compareDocs = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const { docIdA, docIdB, topic } = req.body;

  // Verify ownership of both documents
  const [docA, docB] = await Promise.all([
    Document.findOne({ _id: docIdA, userId }).lean(),
    Document.findOne({ _id: docIdB, userId }).lean(),
  ]);

  if (!docA || !docB) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'One or both documents not found',
    });
  }

  const comparison = await compareDocuments(docIdA, docIdB, topic, userId);

  logger.info('Document comparison complete', { userId, docIdA, docIdB, topic });

  res.json({
    success: true,
    data: {
      comparison,
      documentA: { id: docA._id, name: docA.originalName },
      documentB: { id: docB._id, name: docB.originalName },
      topic,
    },
    message: 'Comparison complete',
  });
});
