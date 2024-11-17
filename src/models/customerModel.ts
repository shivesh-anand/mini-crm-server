import mongoose, { Schema, model } from "mongoose";

interface ICustomer {
  name: string;
  email: string;
  totalSpending: number;
  visits: number;
  lastVisit: Date;
  orders: mongoose.Types.ObjectId[];
}

const customerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  totalSpending: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  lastVisit: { type: Date, default: Date.now },
  orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }],
});

export default model<ICustomer>("Customer", customerSchema);
