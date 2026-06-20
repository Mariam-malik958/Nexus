import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  investorId: mongoose.Types.ObjectId;
  entrepreneurId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  description?: string;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Aapke User model ka naam jo bhi ho
      required: true,
    },
    entrepreneurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'usd',
      lowercase: true,
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending',
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);