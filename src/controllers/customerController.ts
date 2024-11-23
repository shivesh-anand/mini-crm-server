import { Request, Response } from "express";
import customerModel from "../models/customerModel";

export const addCustomer = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const existingCustomer = await customerModel.find({ email });
    if (existingCustomer.length > 0) {
      res.status(400).json({ message: "Customer already exists" });
      return;
    }

    const customer = new customerModel(req.body);
    await customer.save();
    res.status(201).json({ message: "Customer added successfully", customer });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await customerModel.find();
    res.status(200).json(customers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
