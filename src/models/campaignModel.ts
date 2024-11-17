import { Schema, model } from "mongoose";

interface ICampaign {
  name: string;
  audienceSegmentId: Schema.Types.ObjectId;
  sentMessages: number;
  failedMessages: number;
  createdAt: Date;
  audienceSize: number;
}

const campaignSchema = new Schema<ICampaign>(
  {
    name: String,
    audienceSegmentId: { type: Schema.Types.ObjectId, ref: "AudienceSegment" },
    sentMessages: { type: Number, default: 0 },
    failedMessages: { type: Number, default: 0 },
    audienceSize: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model<ICampaign>("Campaign", campaignSchema);
