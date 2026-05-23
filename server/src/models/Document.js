import mongoose from 'mongoose';

const redFlagSchema = new mongoose.Schema(
  {
    clause: { type: String },
    severity: { type: String, enum: ['low', 'medium', 'high'] },
    explanation: { type: String },
  },
  { _id: false }
);

const keyDateSchema = new mongoose.Schema(
  {
    label: { type: String },
    date: { type: Date },
  },
  { _id: false }
);

const extractedClausesSchema = new mongoose.Schema(
  {
    parties: [String],
    startDate: { type: Date },
    endDate: { type: Date },
    noticePeriod: { type: String },
    penaltyClauses: [String],
    autoRenewal: { type: Boolean, default: false },
    depositAmount: { type: String },
    monthlyAmount: { type: String },
    redFlags: [redFlagSchema],
    keyDates: [keyDateSchema],
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    filePublicId: {
      type: String,
      required: [true, 'File public ID is required'],
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image', 'docx'],
      required: true,
    },
    mimeType: { type: String },
    fileSize: { type: Number },
    status: {
      type: String,
      enum: ['queued', 'extracting', 'chunking', 'embedding', 'analyzing', 'ready', 'failed'],
      default: 'queued',
    },
    processingProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    errorMessage: { type: String },
    rawTextHash: { type: String },
    docType: {
      type: String,
      enum: [
        'rental',
        'employment',
        'loan',
        'subscription',
        'insurance',
        'service',
        'nda',
        'society',
        'other',
      ],
    },
    summary: { type: String },
    pageCount: { type: Number },
    extractedClauses: extractedClausesSchema,
    chunkCount: { type: Number },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

documentSchema.index({ userId: 1, status: 1 });
documentSchema.index({ userId: 1, docType: 1 });
documentSchema.index({ rawTextHash: 1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;
