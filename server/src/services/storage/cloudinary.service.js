import cloudinary from '../../config/cloudinary.js';
import logger from '../../utils/logger.js';
import { Readable } from 'stream';

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original file name
 * @param {string} userId - User ID for folder organization
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export const uploadToCloudinary = async (buffer, originalName, userId) => {
  return new Promise((resolve, reject) => {
    const sanitizedName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const publicId = `wdis/${userId}/${sanitizedName}_${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        public_id: publicId,
        folder: undefined, // public_id already includes the folder path
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload failed', { error: error.message, originalName });
          return reject(error);
        }
        logger.info('Cloudinary upload successful', { publicId: result.public_id });
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
  });
};

/**
 * Delete a file from Cloudinary by its public ID.
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    logger.info('Cloudinary delete result', { publicId, result: result.result });
  } catch (error) {
    logger.error('Cloudinary delete failed', { publicId, error: error.message });
    throw error;
  }
};
