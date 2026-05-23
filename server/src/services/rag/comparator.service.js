import { generateSingleEmbedding } from '../ai/embedding.service.js';
import { retrieveRelevantChunks } from './retriever.service.js';
import { generateText } from '../ai/llm.provider.js';
import logger from '../../utils/logger.js';

const COMPARE_SYSTEM_PROMPT = `You are a legal document comparison expert. Compare the two documents based on the given topic.

Structure your comparison as follows:
1. **Overview**: Brief summary of each document's position on the topic
2. **Key Differences**: Point-by-point comparison of differences
3. **Key Similarities**: Common clauses or terms
4. **Which is more favorable?**: Assessment of which document is more favorable to the user on this topic, and why
5. **Red Flags**: Any concerning discrepancies or clauses in either document
6. **Recommendation**: Practical advice based on the comparison

Rules:
- Cite specific clauses from each document with document names
- Be objective and thorough
- Use simple, accessible language
- If information is missing from one document, note it explicitly`;

/**
 * Compare two documents on a specific topic.
 * Embeds the topic, retrieves relevant chunks from both documents, and generates a comparison.
 * @param {string} docIdA - First document ID
 * @param {string} docIdB - Second document ID
 * @param {string} topic - Topic to compare on
 * @param {string} userId - User ID for data isolation
 * @returns {Promise<string>} Comparison analysis text
 */
export const compareDocuments = async (docIdA, docIdB, topic, userId) => {
  // Embed the comparison topic
  const topicEmbedding = await generateSingleEmbedding(topic);

  // Retrieve relevant chunks from both documents in parallel
  const [chunksA, chunksB] = await Promise.all([
    retrieveRelevantChunks(topicEmbedding, userId, { documentId: docIdA }, 5),
    retrieveRelevantChunks(topicEmbedding, userId, { documentId: docIdB }, 5),
  ]);

  // Build context for comparison
  const contextA = chunksA
    .map((c, i) => `[Doc A - Excerpt ${i + 1}, Page ${c.metadata?.pageNumber || '?'}]\n${c.text}`)
    .join('\n\n');

  const contextB = chunksB
    .map((c, i) => `[Doc B - Excerpt ${i + 1}, Page ${c.metadata?.pageNumber || '?'}]\n${c.text}`)
    .join('\n\n');

  const docAName = chunksA[0]?.metadata?.docName || 'Document A';
  const docBName = chunksB[0]?.metadata?.docName || 'Document B';

  const userPrompt = `Compare these two documents on the topic: "${topic}"

--- Document A: "${docAName}" ---
${contextA || 'No relevant excerpts found for this topic.'}

--- Document B: "${docBName}" ---
${contextB || 'No relevant excerpts found for this topic.'}`;

  const comparison = await generateText(COMPARE_SYSTEM_PROMPT, userPrompt, {
    temperature: 0.3,
    maxTokens: 4096,
  });

  logger.info('Document comparison complete', {
    docIdA,
    docIdB,
    topic,
    chunksA: chunksA.length,
    chunksB: chunksB.length,
  });

  return comparison;
};
