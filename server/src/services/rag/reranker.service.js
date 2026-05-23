import { generateJSON } from '../ai/llm.provider.js';
import logger from '../../utils/logger.js';

const RERANK_SYSTEM_PROMPT = `You are a legal document relevance scorer. Given a user query and a list of document excerpts, score each excerpt's relevance to the query on a scale of 0-10.

Return JSON in this exact format:
{
  "scores": [
    { "index": 0, "score": 8, "reason": "brief reason" },
    { "index": 1, "score": 3, "reason": "brief reason" }
  ]
}

Scoring guidelines:
- 9-10: Directly answers the query with specific, relevant information
- 7-8: Highly relevant, contains useful context
- 5-6: Somewhat relevant, tangentially related
- 3-4: Marginally relevant
- 0-2: Not relevant at all

Be strict. Only give high scores to excerpts that genuinely help answer the query.`;

/**
 * Rerank retrieved chunks using LLM-based relevance scoring.
 * Returns top 5 chunks with score >= 5.
 * @param {string} query - User's query
 * @param {Array<{ id: string, score: number, text: string, metadata: object }>} chunks - Retrieved chunks
 * @returns {Promise<Array<{ id: string, score: number, relevanceScore: number, text: string, metadata: object }>>}
 */
export const rerankChunks = async (query, chunks) => {
  if (chunks.length === 0) return [];

  // Build the user prompt with numbered excerpts
  const excerptList = chunks
    .map((chunk, idx) => `[Excerpt ${idx}] (from "${chunk.metadata?.docName || 'Unknown'}", page ${chunk.metadata?.pageNumber || '?'}):\n${chunk.text}`)
    .join('\n\n---\n\n');

  const userPrompt = `Query: "${query}"\n\nExcerpts to score:\n\n${excerptList}`;

  try {
    const result = await generateJSON(RERANK_SYSTEM_PROMPT, userPrompt, {
      temperature: 0.1,
      maxTokens: 2048,
    });

    const scores = result.scores || [];

    // Map scores back to chunks
    const scoredChunks = chunks.map((chunk, idx) => {
      const scoreEntry = scores.find((s) => s.index === idx);
      return {
        ...chunk,
        relevanceScore: scoreEntry?.score ?? 0,
      };
    });

    // Filter (score >= 5) and sort by relevance, take top 5
    const ranked = scoredChunks
      .filter((c) => c.relevanceScore >= 5)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);

    logger.info('Reranking complete', {
      inputChunks: chunks.length,
      outputChunks: ranked.length,
      topScore: ranked[0]?.relevanceScore,
    });

    return ranked;
  } catch (error) {
    logger.error('Reranking failed, returning original order', { error: error.message });
    // Fallback: return top 5 by original vector similarity score
    return chunks.slice(0, 5);
  }
};
