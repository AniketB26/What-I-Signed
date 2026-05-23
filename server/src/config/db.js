import mongoose from 'mongoose';
import logger from '../utils/logger.js';

/**
 * Connect to MongoDB using Mongoose.
 * Uses MONGODB_URI from environment variables.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Fix for Node.js 22 SSL issues with MongoDB Atlas on Windows
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
