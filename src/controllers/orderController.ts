import { Request, Response } from "express";
import mongoose from "mongoose";
import Customer from "../models/customerModel";
import orderModel from "../models/orderModel";

export const addOrder = async (req: Request, res: Response) => {
  try {
    const { customerId, amount, date } = req.body;

    if (!customerId || !amount || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Invalid customerId format" });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const order = new orderModel({
      customerId,
      amount,
      date,
    });
    await order.save();

    customer.totalSpending += amount;
    customer.visits += 1;
    customer.lastVisit = new Date();
    customer.orders.push(order._id);
    await customer.save();

    res.status(201).json({ message: "Order added successfully", order });
  } catch (error: any) {
    console.error("Error in addOrder:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.query;

    if (customerId && !mongoose.Types.ObjectId.isValid(customerId as string)) {
      return res.status(400).json({ message: "Invalid customerId format" });
    }

    let orders;
    if (customerId) {
      orders = await orderModel
        .find({ customerId })
        .populate("customerId", "name email totalSpending");
    } else {
      orders = await orderModel.find().populate("customerId", "name email");
    }

    res.status(200).json(orders);
  } catch (error: any) {
    console.error("Error in getOrders:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
