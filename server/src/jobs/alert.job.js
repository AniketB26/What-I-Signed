import cron from 'node-cron';
import Alert from '../models/Alert.js';
import logger from '../utils/logger.js';

/**
 * Start the daily alert cron job.
 * Runs every day at 9:00 AM to check for upcoming alerts.
 */
export const startAlertCron = () => {
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running daily alert check...');

    try {
      const now = new Date();
      const fourteenDaysFromNow = new Date();
      fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14);

      // Find alerts due within 14 days that haven't been fired, dismissed, or snoozed
      const dueAlerts = await Alert.find({
        fired: false,
        dismissed: false,
        dueDate: { $gte: now, $lte: fourteenDaysFromNow },
        $or: [
          { snoozedUntil: null },
          { snoozedUntil: { $exists: false } },
          { snoozedUntil: { $lte: now } },
        ],
      })
        .populate('userId', 'name email preferences')
        .populate('documentId', 'originalName')
        .lean();

      if (dueAlerts.length === 0) {
        logger.info('No alerts due in the next 14 days');
        return;
      }

      logger.info(`Found ${dueAlerts.length} alerts to process`);

      for (const alert of dueAlerts) {
        const userName = alert.userId?.name || 'User';
        const userEmail = alert.userId?.email || 'unknown';
        const docName = alert.documentId?.originalName || 'Unknown Document';
        const daysUntilDue = Math.ceil((alert.dueDate - now) / (1000 * 60 * 60 * 24));

        // Log the alert (email integration in Phase 3)
        logger.info('Alert due', {
          alertId: alert._id,
          type: alert.alertType,
          severity: alert.severity,
          user: userName,
          email: userEmail,
          document: docName,
          message: alert.message,
          dueDate: alert.dueDate,
          daysUntilDue,
        });

        // Mark as fired
        await Alert.findByIdAndUpdate(alert._id, { fired: true });
      }

      logger.info(`Processed ${dueAlerts.length} alerts`);
    } catch (error) {
      logger.error('Alert cron job failed', { error: error.message });
    }
  });

  logger.info('Alert cron job scheduled: daily at 9:00 AM');
};
