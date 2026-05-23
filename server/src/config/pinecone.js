import { Pinecone } from '@pinecone-database/pinecone';
import logger from '../utils/logger.js';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const indexName = process.env.PINECONE_INDEX || 'wdis-documents';

/**
 * Get the Pinecone index reference.
 * @returns {import('@pinecone-database/pinecone').Index}
 */
const getPineconeIndex = () => {
  logger.info(`Using Pinecone index: ${indexName}`);
  return pc.index(indexName);
};

const pineconeIndex = getPineconeIndex();

export { pineconeIndex, pc };
export default pineconeIndex;
