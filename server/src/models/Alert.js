import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    alertType: {
      type: String,
      enum: ['expiry', 'renewal', 'notice_deadline', 'red_flag'],
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Alert message is required'],
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info',
    },
    dueDate: { type: Date },
    fired: { type: Boolean, default: false },
    dismissed: { type: Boolean, default: false },
    snoozedUntil: { type: Date },
  },
  { timestamps: true }
);

alertSchema.index({ userId: 1, fired: 1, dismissed: 1 });
alertSchema.index({ dueDate: 1, fired: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
