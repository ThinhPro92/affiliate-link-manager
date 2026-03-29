import mongoose, { Schema, Document } from "mongoose";

export interface ILink extends Document {
  title: string;
  originalUrl: string;
  shortCode: string;
  userId: mongoose.Types.ObjectId;
  totalClicks: number;
  createdAt: Date;
  fallbackUrl: string;
  status: "active" | "broken";
  campaignId?: mongoose.Types.ObjectId | null;
}

const LinkSchema = new Schema(
  {
    title: { type: String, required: true },
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalClicks: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    fallbackUrl: { type: String, default: "" },
    status: { type: String, enum: ["active", "broken"], default: "active" },
    campaignId: { type: Schema.Types.ObjectId, ref: "Campaign", default: null },
  },
  { timestamps: true },
);

export default mongoose.model<ILink>("Link", LinkSchema);
