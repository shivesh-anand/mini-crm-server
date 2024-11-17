import { Request, Response } from "express";
import customerModel from "../models/customerModel";

export const addCustomer = async (req: Request, res: Response) => {
  try {
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
