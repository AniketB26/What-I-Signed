import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../../utils/logger.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const EMBEDDING_MODEL = 'gemini-embedding-001';
const OUTPUT_DIMENSIONALITY = 768;
const BATCH_SIZE = 50;

/**
 * Generate embeddings for multiple texts in batches of 50.
 * @param {string[]} texts - Array of text strings to embed
 * @returns {Promise<number[][]>} Array of embedding vectors
 */
export const generateEmbeddings = async (texts) => {
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const result = await model.batchEmbedContents({
      requests: batch.map((text) => ({
        content: { parts: [{ text }] },
        outputDimensionality: OUTPUT_DIMENSIONALITY,
      })),
    });

    const batchEmbeddings = result.embeddings.map((e) => e.values);
    allEmbeddings.push(...batchEmbeddings);

    logger.debug(`Embedded batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(texts.length / BATCH_SIZE)}`);
  }

  logger.info('Batch embedding complete', { totalTexts: texts.length, totalEmbeddings: allEmbeddings.length });
  return allEmbeddings;
};

/**
 * Generate a single embedding for one text.
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} Embedding vector
 */
export const generateSingleEmbedding = async (text) => {
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

  const result = await model.embedContent({
    content: { parts: [{ text }] },
    outputDimensionality: OUTPUT_DIMENSIONALITY,
  });

  return result.embedding.values;
};
