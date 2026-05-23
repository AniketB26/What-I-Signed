import Alert from '../models/Alert.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

/**
 * @route   GET /api/alerts
 * @desc    List user's alerts with optional filters
 * @access  Private
 */
export const listAlerts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { type, severity, dismissed } = req.query;

  const filter = { userId };
  if (type) filter.alertType = type;
  if (severity) filter.severity = severity;
  if (dismissed !== undefined) filter.dismissed = dismissed === 'true';

  const alerts = await Alert.find(filter)
    .populate('documentId', 'originalName docType')
    .sort({ dueDate: 1 })
    .lean();

  res.json({
    success: true,
    data: { alerts },
    message: 'Alerts retrieved',
  });
});

/**
 * @route   PUT /api/alerts/:id/dismiss
 * @desc    Dismiss an alert
 * @access  Private
 */
export const dismissAlert = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, userId },
    { dismissed: true },
    { new: true }
  );

  if (!alert) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Alert not found',
    });
  }

  logger.info('Alert dismissed', { alertId: alert._id, userId });

  res.json({
    success: true,
    data: { alert },
    message: 'Alert dismissed',
  });
});

/**
 * @route   PUT /api/alerts/:id/snooze
 * @desc    Snooze an alert for a given number of days
 * @access  Private
 */
export const snoozeAlert = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { snoozeDays = 7 } = req.body;

  const snoozedUntil = new Date();
  snoozedUntil.setDate(snoozedUntil.getDate() + parseInt(snoozeDays, 10));

  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, userId },
    { snoozedUntil },
    { new: true }
  );

  if (!alert) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Alert not found',
    });
  }

  logger.info('Alert snoozed', { alertId: alert._id, userId, snoozedUntil });

  res.json({
    success: true,
    data: { alert },
    message: `Alert snoozed until ${snoozedUntil.toLocaleDateString()}`,
  });
});
