import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import agenda from './config/agenda.js';
import { defineDocumentJob } from './jobs/document.job.js';
import { startAlertCron } from './jobs/alert.job.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Define Agenda jobs and start
    defineDocumentJob(agenda);
    await agenda.start();
    logger.info('Agenda job processor started');

    // Start alert cron
    startAlertCron();

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // ── Graceful shutdown ──
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await agenda.stop();
          logger.info('Agenda stopped');
        } catch (err) {
          logger.error('Error stopping Agenda', { error: err.message });
        }

        try {
          const mongoose = (await import('mongoose')).default;
          await mongoose.connection.close();
          logger.info('MongoDB connection closed');
        } catch (err) {
          logger.error('Error closing MongoDB', { error: err.message });
        }

        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

startServer();
