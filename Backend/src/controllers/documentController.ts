import { Request, Response } from 'express';
import Doc from '../models/Document';

// Upload Document
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const file = req.file as any;

    console.log('File received:', file);
    console.log('Body received:', req.body);

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const doc = await Doc.create({
      fileName:   file.originalname,
      fileUrl:    file.path,
      fileType:   file.mimetype,
      uploadedBy: req.body.userId || '000000000000000000000000',
      projectId:  req.body.projectId || 'default',
    });

    res.status(201).json({ success: true, document: doc });
  } catch (error: any) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get All Documents
export const getDocuments = async (req: Request, res: Response) => {
  try {
    const docs = await Doc.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(docs);
  } catch (error: any) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get Single Document
export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const doc = await Doc.findById(req.params.id)
      .populate('uploadedBy', 'name email');

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(doc);
  } catch (error: any) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete Document
export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const doc = await Doc.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ success: true, message: 'Document deleted' });
  } catch (error: any) {
    console.error('Delete error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Sign Document
export const signDocument = async (req: Request, res: Response) => {
  try {
    const { signatureImage, userId } = req.body;

    const doc = await Doc.findByIdAndUpdate(
      req.params.id,
      {
        status: 'signed',
        signature: {
          imageUrl: signatureImage,
          signedBy: userId,
          signedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ success: true, document: doc });
  } catch (error: any) {
    console.error('Sign error:', error.message);
    res.status(500).json({ message: error.message });
  }
};