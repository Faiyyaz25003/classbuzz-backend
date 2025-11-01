// models/Document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  documentType: {
    type: String,
    required: [true, 'Document type is required'],
    trim: true
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  originalName: {
    type: String,
    required: [true, 'Original file name is required']
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  remarks: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
documentSchema.index({ userId: 1, uploadedAt: -1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;