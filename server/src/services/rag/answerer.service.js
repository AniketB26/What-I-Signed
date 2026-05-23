import { generateText, streamText } from '../ai/llm.provider.js';
import logger from '../../utils/logger.js';

const ANSWER_SYSTEM_PROMPT = `You are a legal document assistant for the "What Did I Sign?" app. Answer the user's question using ONLY the provided document excerpts.

Rules:
1. Base your answer ONLY on the provided excerpts — never invent or assume clauses
2. Cite the source document name and page number for every claim, e.g. [Document: "Rental Agreement", Page 3]
3. If the excerpts don't contain enough information, say so clearly
4. Use simple, clear language — avoid unnecessary legal jargon
5. Highlight any concerning clauses or red flags you notice
6. Structure your answer with clear headings if the answer is long
7. If multiple documents are referenced, organize by document`;

/**
 * Build context string from ranked chunks.
 * @param {Array<{ text: string, metadata: object }>} rankedChunks
 * @returns {string}
 */
const buildContext = (rankedChunks) => {
  return rankedChunks
    .map((chunk, idx) => {
      const docName = chunk.metadata?.docName || 'Unknown Document';
      const page = chunk.metadata?.pageNumber || '?';
      return `--- Excerpt ${idx + 1} (Source: "${docName}", Page ${page}) ---\n${chunk.text}`;
    })
    .join('\n\n');
};

/**
 * Generate a complete answer for a query using ranked chunks.
 * @param {string} query - User's question
 * @param {Array<{ text: string, metadata: object }>} rankedChunks - Reranked relevant chunks
 * @returns {Promise<string>} Generated answer with citations
 */
export const generateAnswer = async (query, rankedChunks) => {
  if (rankedChunks.length === 0) {
    return 'I could not find any relevant information in your documents to answer this question. Please try rephrasing your question or ensure the relevant document has been uploaded and processed.';
  }

  const context = buildContext(rankedChunks);
  const userPrompt = `Document Excerpts:\n\n${context}\n\n---\n\nUser Question: ${query}`;

  const answer = await generateText(ANSWER_SYSTEM_PROMPT, userPrompt, {
    temperature: 0.3,
    maxTokens: 4096,
  });

  logger.info('Answer generated', { queryLength: query.length, chunksUsed: rankedChunks.length });
  return answer;
};

/**
 * Stream an answer for a query using ranked chunks via SSE.
 * @param {string} query - User's question
 * @param {Array<{ text: string, metadata: object }>} rankedChunks - Reranked relevant chunks
 * @returns {AsyncGenerator<string>} Async generator yielding text chunks
 */
export async function* streamAnswer(query, rankedChunks) {
  if (rankedChunks.length === 0) {
    yield 'I could not find any relevant information in your documents to answer this question. Please try rephrasing your question or ensure the relevant document has been uploaded and processed.';
    return;
  }

  const context = buildContext(rankedChunks);
  const userPrompt = `Document Excerpts:\n\n${context}\n\n---\n\nUser Question: ${query}`;

  const stream = streamText(ANSWER_SYSTEM_PROMPT, userPrompt, {
    temperature: 0.3,
    maxTokens: 4096,
  });

  for await (const chunk of stream) {
    yield chunk;
  }

  logger.info('Streamed answer complete', { queryLength: query.length, chunksUsed: rankedChunks.length });
}
