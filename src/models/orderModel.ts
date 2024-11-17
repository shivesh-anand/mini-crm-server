import { Schema, Types, model } from "mongoose";
import Customer from "./customerModel"; // Import Customer model

interface IOrder {
  customerId: Schema.Types.ObjectId;
  amount: number;
  date: Date;
}

const orderSchema = new Schema<IOrder>({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

orderSchema.post("save", async function (this: IOrder) {
  try {
    const customer = await Customer.findById(this.customerId);
    if (customer) {
      customer.totalSpending += this.amount;

      customer.visits += 1;

      customer.lastVisit = new Date();

      customer.orders.push(this.customerId as any as Types.ObjectId);

      await customer.save();
    } else {
      console.error(`Customer not found for order with ID: ${this.customerId}`);
    }
  } catch (err) {
    console.error("Error updating customer totalSpending and orders:", err);
  }
});

export default model<IOrder>("Order", orderSchema);
