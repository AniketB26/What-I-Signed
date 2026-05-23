import pdfParse from 'pdf-parse';
import logger from '../../utils/logger.js';

/**
 * Extract text content from a PDF buffer.
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<{ text: string, pageCount: number }>}
 */
export const extractFromPdf = async (buffer) => {
  try {
    const data = await pdfParse(buffer);

    const text = data.text || '';
    const pageCount = data.numpages || 1;

    logger.info('PDF extraction complete', {
      pageCount,
      textLength: text.length,
    });

    return { text, pageCount };
  } catch (error) {
    logger.error('PDF extraction failed', { error: error.message });
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};
