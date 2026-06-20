import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: mongoose.Types.ObjectId;
  projectId?: string;
  version: number;
  status: 'draft' | 'reviewed' | 'signed';
  signature?: {
    imageUrl: string;
    signedBy: mongoose.Types.ObjectId;
    signedAt: Date;
  };
}

const DocumentSchema = new Schema<IDocument>(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: String,
    },
    version: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['draft', 'reviewed', 'signed'],
      default: 'draft',
    },
    signature: {
      imageUrl: { type: String },
      signedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      signedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDocument>('Document', DocumentSchema);