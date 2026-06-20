import express from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  signDocument,
} from '../controllers/documentController';
import { upload } from '../config/cloudinary';

const router = express.Router();

// Upload Document
router.post('/upload', upload.single('file'), uploadDocument);

// Get All Documents
router.get('/', getDocuments);

// Get Single Document
router.get('/:id', getDocumentById);

// Delete Document
router.delete('/:id', deleteDocument);

// Sign Document
router.post('/:id/sign', signDocument);

export default router;