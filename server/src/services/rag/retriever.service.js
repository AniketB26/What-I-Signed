import { queryVectors } from '../vector/pinecone.service.js';
import Chunk from '../../models/Chunk.js';
import logger from '../../utils/logger.js';

/**
 * Retrieve relevant chunks by querying Pinecone and enriching with full text from MongoDB.
 * @param {number[]} queryEmbedding - Query embedding vector
 * @param {string} userId - User ID for filtering
 * @param {{ documentId?: string, docType?: string }} [filters={}] - Optional filters
 * @param {number} [topK=10] - Number of top results
 * @returns {Promise<Array<{ id: string, score: number, text: string, metadata: object }>>}
 */
export const retrieveRelevantChunks = async (queryEmbedding, userId, filters = {}, topK = 10) => {
  // Query Pinecone for similar vectors
  const pineconeResults = await queryVectors(queryEmbedding, userId, filters, topK);

  if (pineconeResults.length === 0) {
    logger.info('No relevant chunks found in Pinecone');
    return [];
  }

  // Get full text from MongoDB
  const pineconeIds = pineconeResults.map((r) => r.id);
  const chunks = await Chunk.find({
    pineconeId: { $in: pineconeIds },
    userId,
  }).lean();

  // Create a lookup map
  const chunkMap = new Map();
  for (const chunk of chunks) {
    chunkMap.set(chunk.pineconeId, chunk);
  }

  // Enrich Pinecone results with full text
  const enriched = pineconeResults.map((result) => {
    const mongoChunk = chunkMap.get(result.id);
    return {
      id: result.id,
      score: result.score,
      text: mongoChunk?.text || result.metadata?.text || '',
      metadata: {
        ...result.metadata,
        docName: mongoChunk?.metadata?.docName || result.metadata?.docName || '',
        docType: mongoChunk?.metadata?.docType || result.metadata?.docType || '',
        pageNumber: mongoChunk?.metadata?.pageNumber || result.metadata?.pageNumber,
        chunkIndex: mongoChunk?.metadata?.chunkIndex || result.metadata?.chunkIndex,
      },
    };
  });

  logger.info('Chunk retrieval complete', {
    pineconeMatches: pineconeResults.length,
    mongoEnriched: chunks.length,
  });

  return enriched;
};
