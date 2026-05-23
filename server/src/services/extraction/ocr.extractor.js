import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import logger from '../../utils/logger.js';

/**
 * Extract text from an image buffer using OCR.
 * Preprocesses with sharp (grayscale, sharpen, normalize) for better accuracy.
 * @param {Buffer} buffer - Image file buffer
 * @returns {Promise<{ text: string, pageCount: number }>}
 */
export const extractWithOCR = async (buffer) => {
  try {
    // Preprocess image for better OCR accuracy
    const processedBuffer = await sharp(buffer)
      .grayscale()
      .sharpen()
      .normalize()
      .png()
      .toBuffer();

    logger.info('Image preprocessed for OCR', {
      originalSize: buffer.length,
      processedSize: processedBuffer.length,
    });

    const { data } = await Tesseract.recognize(processedBuffer, 'eng', {
      logger: (info) => {
        if (info.status === 'recognizing text') {
          logger.debug(`OCR progress: ${Math.round(info.progress * 100)}%`);
        }
      },
    });

    const text = data.text || '';

    logger.info('OCR extraction complete', { textLength: text.length, confidence: data.confidence });

    return { text, pageCount: 1 };
  } catch (error) {
    logger.error('OCR extraction failed', { error: error.message });
    throw new Error(`OCR extraction failed: ${error.message}`);
  }
};
