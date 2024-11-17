import { Request, Response } from "express";
import communicationsLogModel from "../models/communicationsLogModel";

export const deliveryReceipt = async (req: Request, res: Response) => {
  const { logId } = req.body;

  try {
    const log = await communicationsLogModel.findById(logId);
    if (!log) {
      res.status(404).json({ message: "Log not found" });
      return;
    }

    const status = Math.random() < 0.9 ? "SENT" : "FAILED";
    log.status = status;
    log.sentAt = new Date();
    await log.save();

    res.status(200).json({ status });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
};
