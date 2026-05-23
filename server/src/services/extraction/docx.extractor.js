import mammoth from 'mammoth';
import logger from '../../utils/logger.js';

/**
 * Extract raw text from a DOCX buffer.
 * @param {Buffer} buffer - DOCX file buffer
 * @returns {Promise<{ text: string, pageCount: number }>}
 */
export const extractFromDocx = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });

    const text = result.value || '';

    if (result.messages && result.messages.length > 0) {
      logger.warn('DOCX extraction warnings', {
        warnings: result.messages.map((m) => m.message),
      });
    }

    // Estimate page count (~3000 chars per page)
    const pageCount = Math.max(1, Math.ceil(text.length / 3000));

    logger.info('DOCX extraction complete', {
      textLength: text.length,
      estimatedPages: pageCount,
    });

    return { text, pageCount };
  } catch (error) {
    logger.error('DOCX extraction failed', { error: error.message });
    throw new Error(`DOCX extraction failed: ${error.message}`);
  }
};
