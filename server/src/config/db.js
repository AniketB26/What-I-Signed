import mongoose from 'mongoose';
import logger from '../utils/logger.js';

/**
 * Connect to MongoDB using Mongoose.
 *
 * Atlas (`mongodb+srv://`) always speaks TLS, while a local or containerised
 * mongod does not — forcing `tls: true` on the latter makes the handshake fail,
 * so the option is derived from the connection string instead of hardcoded.
 *
 * `MONGODB_TLS_ALLOW_INVALID_CERTS=true` is an escape hatch for the Node 22 +
 * Atlas + Windows certificate issue. It disables certificate validation, so it
 * must stay opt-in and must never be set in production.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    logger.error('MONGODB_URI is not set. Copy .env.example to server/.env and fill it in.');
    process.exit(1);
  }

  const isSrv = uri.startsWith('mongodb+srv://');
  const allowInvalidCerts = process.env.MONGODB_TLS_ALLOW_INVALID_CERTS === 'true';

  if (allowInvalidCerts && process.env.NODE_ENV === 'production') {
    logger.warn(
      'MONGODB_TLS_ALLOW_INVALID_CERTS is enabled in production — TLS certificates are NOT being verified.'
    );
  }

  const options = {
    serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS) || 10000,
    ...(isSrv ? { tls: true } : {}),
    ...(allowInvalidCerts ? { tlsAllowInvalidCertificates: true } : {}),
  };

  try {
    const conn = await mongoose.connect(uri, options);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);

    // The most common failure is an Atlas cluster that no longer exists, which
    // surfaces as an SRV lookup miss rather than anything auth-related.
    if (error.message.includes('querySrv ENOTFOUND')) {
      logger.error(
        'The Atlas cluster hostname did not resolve. The cluster was most likely deleted, ' +
          'or MONGODB_URI is wrong. Create a new cluster and update MONGODB_URI, ' +
          'or run `docker compose up` to use the bundled MongoDB.'
      );
    }

    process.exit(1);
  }
};

export default connectDB;
