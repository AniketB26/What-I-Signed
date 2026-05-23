import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: [true, 'Chunk text is required'],
    },
    pineconeId: {
      type: String,
      required: [true, 'Pinecone vector ID is required'],
    },
    metadata: {
      docName: { type: String },
      docType: { type: String },
      pageNumber: { type: Number },
      chunkIndex: { type: Number },
    },
  },
  { timestamps: true }
);

const Chunk = mongoose.model('Chunk', chunkSchema);

export default Chunk;
