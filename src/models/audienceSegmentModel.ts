import mongoose, { Schema, Document, Types } from "mongoose";

interface Condition {
  field: string;
  operator: string;
  value: any;
  logic?: string;
}

interface AudienceSegment extends Document {
  name: string;
  conditions: Condition[];
  size: number;
  customerIds: Types.ObjectId[];
  createdAt: Date;
}

const conditionSchema = new Schema<Condition>({
  field: { type: String, required: true },
  operator: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
  logic: { type: String, enum: ["AND", "OR"], default: "AND" },
});

const audienceSegmentSchema = new Schema<AudienceSegment>(
  {
    name: { type: String, required: true },
    conditions: [conditionSchema],
    size: { type: Number, required: true },
    customerIds: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
  },
  { timestamps: true }
);

export default mongoose.model<AudienceSegment>(
  "AudienceSegment",
  audienceSegmentSchema
);
