import { generateJSON } from '../ai/llm.provider.js';
import logger from '../../utils/logger.js';

const SYSTEM_PROMPT = `You are an expert legal document parser. Analyze the provided document text and extract structured information.

You MUST return valid JSON matching this exact schema:
{
  "parties": ["Party A name", "Party B name"],
  "startDate": "YYYY-MM-DD or null",
  "endDate": "YYYY-MM-DD or null",
  "noticePeriod": "description or null",
  "penaltyClauses": ["penalty description 1"],
  "autoRenewal": true/false,
  "depositAmount": "amount with currency or null",
  "monthlyAmount": "amount with currency or null",
  "redFlags": [
    {
      "clause": "the problematic clause text",
      "severity": "low|medium|high",
      "explanation": "why this is a red flag"
    }
  ],
  "keyDates": [
    {
      "label": "description of the date",
      "date": "YYYY-MM-DD"
    }
  ],
  "docType": "rental|employment|loan|subscription|insurance|service|nda|society|other",
  "summary": "brief 2-3 sentence summary of the document"
}

Rules:
- Extract ALL parties mentioned
- Flag any one-sided, unfair, or unusual clauses as redFlags
- Set severity "high" for clauses that could cause financial loss or legal liability
- Use null for fields where information is not found
- Be thorough with penalty clauses and key dates
- docType should be your best classification of the document type`;

/**
 * Build a fallback clauses object when extraction fails.
 * @returns {object}
 */
const buildFallback = () => ({
  parties: [],
  startDate: null,
  endDate: null,
  noticePeriod: null,
  penaltyClauses: [],
  autoRenewal: false,
  depositAmount: null,
  monthlyAmount: null,
  redFlags: [],
  keyDates: [],
  docType: 'other',
  summary: 'Unable to extract document details automatically.',
});

/**
 * Extract structured clauses from raw document text using LLM.
 * Truncates long documents: first 6000 + last 2000 chars.
 * @param {string} rawText - Full document text
 * @returns {Promise<object>} Extracted clauses matching Document.extractedClauses schema
 */
export const extractClauses = async (rawText) => {
  try {
    let textForAnalysis = rawText;

    // Truncate very long documents
    if (rawText.length > 10000) {
      const firstPart = rawText.substring(0, 6000);
      const lastPart = rawText.substring(rawText.length - 2000);
      textForAnalysis = `${firstPart}\n\n[... middle section truncated for processing ...]\n\n${lastPart}`;
      logger.info('Document text truncated for clause extraction', {
        originalLength: rawText.length,
        truncatedLength: textForAnalysis.length,
      });
    }

    const result = await generateJSON(SYSTEM_PROMPT, textForAnalysis, {
      temperature: 0.1,
      maxTokens: 4096,
    });

    // Normalize dates to proper format
    if (result.startDate && typeof result.startDate === 'string') {
      result.startDate = new Date(result.startDate);
      if (isNaN(result.startDate.getTime())) result.startDate = null;
    }
    if (result.endDate && typeof result.endDate === 'string') {
      result.endDate = new Date(result.endDate);
      if (isNaN(result.endDate.getTime())) result.endDate = null;
    }
    if (result.keyDates) {
      result.keyDates = result.keyDates.map((kd) => ({
        ...kd,
        date: kd.date ? new Date(kd.date) : null,
      })).filter((kd) => kd.date && !isNaN(kd.date.getTime()));
    }

    logger.info('Clause extraction complete', {
      parties: result.parties?.length || 0,
      redFlags: result.redFlags?.length || 0,
      docType: result.docType,
    });

    return result;
  } catch (error) {
    logger.error('Clause extraction failed, returning fallback', { error: error.message });
    return buildFallback();
  }
};
