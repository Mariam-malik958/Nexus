import mongoose, { Document, Schema } from "mongoose";

export interface IMeeting extends Document {
  title: string;
  investorId?: mongoose.Types.ObjectId;
  entrepreneurId?: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: "pending" | "accepted" | "rejected";
}

const MeetingSchema = new Schema<IMeeting>(
  {
    title: {
      type: String,
      required: true,
    },
    investorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,  // optional kar diya
    },
    entrepreneurId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,  // optional kar diya
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMeeting>("Meeting", MeetingSchema);