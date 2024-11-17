import { Schema, model } from "mongoose";

interface ICommunicationsLog {
  campaignId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  message: string;
  status: "PENDING" | "SENT" | "FAILED";
  sentAt?: Date;
}

const communicationsLogSchema = new Schema<ICommunicationsLog>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING",
    },
    sentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default model<ICommunicationsLog>(
  "CommunicationsLog",
  communicationsLogSchema
);
