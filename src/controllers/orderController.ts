import { Request, Response } from "express";
import orderModel from "../models/orderModel";
import Customer from "../models/customerModel"; // Import Customer model
import mongoose from "mongoose";

export const addOrder = async (req: Request, res: Response) => {
  try {
    const { customerId, amount, date } = req.body;

    const customerObjectId = new mongoose.Schema.Types.ObjectId(customerId);

    const order = new orderModel({
      customerId: customerObjectId,
      amount,
      date,
    });

    await order.save();

    const customer = await Customer.findById(customerObjectId);

    if (customer) {
      customer.totalSpending += amount;
      customer.visits += 1;
      customer.lastVisit = new Date();
      customer.orders.push(order._id);

      await customer.save();
    }

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const customerId = req.query.customerId as string;

    let orders;
    if (customerId) {
      orders = await orderModel.find({ customerId }).populate("customerId"); // Populate to get customer data along with orders
    } else {
      orders = await orderModel.find();
    }

    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
