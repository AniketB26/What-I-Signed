import pineconeIndex from '../../config/pinecone.js';
import logger from '../../utils/logger.js';

const BATCH_SIZE = 100;

/**
 * Upsert embedding vectors to Pinecone in batches.
 * @param {Array<{ text: string, metadata: object }>} chunks - Document chunks
 * @param {number[][]} embeddings - Corresponding embedding vectors
 * @param {{ documentId: string, userId: string, docType: string, docName: string }} metadata - Shared metadata
 * @returns {Promise<string[]>} Array of Pinecone vector IDs
 */
export const upsertVectors = async (chunks, embeddings, metadata) => {
  const { documentId, userId, docType, docName } = metadata;
  const vectorIds = [];

  const vectors = chunks.map((chunk, idx) => {
    const vectorId = `${documentId}-${chunk.metadata.chunkIndex}`;
    vectorIds.push(vectorId);

    return {
      id: vectorId,
      values: embeddings[idx],
      metadata: {
        userId: userId.toString(),
        documentId: documentId.toString(),
        docType: docType || 'other',
        docName: docName || '',
        pageNumber: chunk.metadata.pageNumber,
        chunkIndex: chunk.metadata.chunkIndex,
        text: chunk.text.substring(0, 1000),
      },
    };
  });

  // Upsert in batches
  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE);
    await pineconeIndex.upsert(batch);
    logger.debug(`Upserted Pinecone batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(vectors.length / BATCH_SIZE)}`);
  }

  logger.info('Pinecone upsert complete', { vectorCount: vectors.length, documentId });
  return vectorIds;
};

/**
 * Query Pinecone for similar vectors.
 * @param {number[]} queryEmbedding - Query embedding vector
 * @param {string} userId - User ID for filtering
 * @param {{ documentId?: string, docType?: string }} [filters={}] - Optional filters
 * @param {number} [topK=10] - Number of top results
 * @returns {Promise<Array<{ id: string, score: number, metadata: object }>>}
 */
export const queryVectors = async (queryEmbedding, userId, filters = {}, topK = 10) => {
  const filter = { userId: { $eq: userId.toString() } };

  if (filters.documentId) {
    filter.documentId = { $eq: filters.documentId.toString() };
  }
  if (filters.docType) {
    filter.docType = { $eq: filters.docType };
  }

  const results = await pineconeIndex.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
    filter,
  });

  logger.info('Pinecone query complete', {
    matchCount: results.matches?.length || 0,
    topK,
  });

  return (results.matches || []).map((match) => ({
    id: match.id,
    score: match.score,
    metadata: match.metadata,
  }));
};

/**
 * Delete all vectors for a specific document from Pinecone.
 * @param {string} documentId - Document ID
 * @returns {Promise<void>}
 */
export const deleteVectorsByDocument = async (documentId) => {
  try {
    // Fetch all vector IDs with this documentId using metadata filter
    const results = await pineconeIndex.query({
      vector: new Array(768).fill(0),
      topK: 10000,
      includeMetadata: false,
      filter: { documentId: { $eq: documentId.toString() } },
    });

    const ids = (results.matches || []).map((m) => m.id);

    if (ids.length > 0) {
      // Delete in batches
      for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const batch = ids.slice(i, i + BATCH_SIZE);
        await pineconeIndex.deleteMany(batch);
      }
      logger.info('Pinecone vectors deleted', { documentId, count: ids.length });
    } else {
      logger.info('No Pinecone vectors found to delete', { documentId });
    }
  } catch (error) {
    logger.error('Failed to delete Pinecone vectors', { documentId, error: error.message });
    throw error;
  }
};
