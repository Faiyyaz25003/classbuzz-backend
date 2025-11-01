// controllers/documentController.js
import Document from "../Models/documentModel.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/documents';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png) and PDF files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
}).any(); // Accept any number of files

// Upload documents (unlimited files)
export const uploadDocuments = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        success: false, 
        message: `Multer error: ${err.message}` 
      });
    } else if (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }

    try {
      const { userId } = req.body;

      if (!userId) {
        // Delete uploaded files if userId is missing
        if (req.files) {
          req.files.forEach(file => fs.unlinkSync(file.path));
        }
        return res.status(400).json({ 
          success: false, 
          message: 'User ID is required' 
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'No files uploaded' 
        });
      }

      // Save each document to database
      const uploadedDocs = [];
      for (const file of req.files) {
        const document = new Document({
          userId,
          documentType: file.fieldname,
          fileName: file.filename,
          originalName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype
        });

        const savedDoc = await document.save();
        uploadedDocs.push(savedDoc);
      }

      res.status(201).json({
        success: true,
        message: `${uploadedDocs.length} document(s) uploaded successfully`,
        documents: uploadedDocs
      });

    } catch (error) {
      // Delete uploaded files if database save fails
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: 'Server error during upload',
        error: error.message 
      });
    }
  });
};

// Get all documents for a user
export const getUserDocuments = async (req, res) => {
  try {
    const { userId } = req.params;

    const documents = await Document.find({ userId }).sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      documents
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching documents',
      error: error.message 
    });
  }
};

// Get single document by ID
export const getDocumentById = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found' 
      });
    }

    res.status(200).json({
      success: true,
      document
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching document',
      error: error.message 
    });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found' 
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Delete from database
    await Document.findByIdAndDelete(documentId);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting document',
      error: error.message 
    });
  }
};

// Get all users with their documents
export const getAllUsersDocuments = async (req, res) => {
  try {
    const documents = await Document.aggregate([
      {
        $group: {
          _id: '$userId',
          totalDocuments: { $sum: 1 },
          documents: { $push: '$$ROOT' },
          lastUpload: { $max: '$uploadedAt' }
        }
      },
      {
        $sort: { lastUpload: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      totalUsers: documents.length,
      users: documents
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching users documents',
      error: error.message 
    });
  }
};

// Download document
export const downloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found' 
      });
    }

    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found on server' 
      });
    }

    res.download(document.filePath, document.originalName);

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error downloading document',
      error: error.message 
    });
  }
};