// routes/documentRoutes.js
import express from 'express';
import {
  uploadDocuments,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
  getAllUsersDocuments,
  downloadDocument
} from "../Controller/documentController.js";
const router = express.Router();

// Upload documents (unlimited files)
router.post('/upload', uploadDocuments);

// Get all documents for a specific user
router.get('/user/:userId', getUserDocuments);

// Get single document by ID
router.get('/:documentId', getDocumentById);

// Delete document
router.delete('/:documentId', deleteDocument);

// Get all users with their documents (admin view)
router.get('/admin/all-users', getAllUsersDocuments);

// Download document
router.get('/download/:documentId', downloadDocument);

export default router;