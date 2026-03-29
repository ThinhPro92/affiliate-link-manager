import mongoose, { Schema, type Document } from "mongoose";

export interface IClick extends Document {
  linkId: mongoose.Types.ObjectId;
  ip: string;
  userAgent: string;
  referrer: string;
  createdAt: Date;
}

const ClickSchema = new Schema(
  {
    linkId: { type: Schema.Types.ObjectId, ref: "Link", required: true },
    ip: { type: String, default: "unknown" },
    userAgent: { type: String, default: "unknown" },
    referrer: { type: String, default: "direct" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

ClickSchema.index({ linkId: 1, createdAt: -1 });

export default mongoose.model<IClick>("Click", ClickSchema);
