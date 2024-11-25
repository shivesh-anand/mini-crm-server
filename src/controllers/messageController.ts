import axios from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
import audienceSegmentModel from "../models/audienceSegmentModel";
import communicationsLogModel from "../models/communicationsLogModel";
import customerModel from "../models/customerModel";
dotenv.config();

const DELIVERY_RECEIPT_API_URL = `${process.env.SERVER_URL}/api/delivery-receipt`;

const callDeliveryReceiptApi = async (logId: string) => {
  try {
    console.log(`Calling Delivery Receipt API with logId: ${logId}`);
    const response = await axios.post(`${DELIVERY_RECEIPT_API_URL}/${logId}`);
    console.log("Delivery Receipt API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error calling Delivery Receipt API:", error);
    throw new Error("Failed to update delivery status");
  }
};

export const sendMessages = async (req: Request, res: Response) => {
  const { audienceId, messageBody } = req.body;

  if (!messageBody || typeof messageBody !== "string") {
    res.status(400).json({ message: "Message body is required" });
    return;
  }

  try {
    const audience = await audienceSegmentModel.findById(audienceId);
    if (!audience) {
      res.status(404).json({ message: "Audience not found" });
      return;
    }

    const customers = await customerModel.find({
      _id: { $in: audience.customerIds },
    });
    if (customers.length === 0) {
      res.status(404).json({ message: "No customers found for this audience" });
      return;
    }

    for (const customer of customers) {
      try {
        const message = `Hi ${customer.name}, ${messageBody}`;
        const log = await communicationsLogModel.create({
          audienceId,
          customerId: customer._id,
          customerName: customer.name,
          customerEmail: customer.email,
          campaignId: audienceId,
          message,
          status: "PENDING",
        });

        console.log(`Created log for customer ${customer.name}:`, log);

        const { status } = await callDeliveryReceiptApi(log._id.toString());
        log.status = status;
        await log.save();
      } catch (error) {
        console.error(`Error processing customer ${customer.name}:`, error);
      }
    }

    res.status(200).json({ message: "Messages sent to queued customers" });
  } catch (error) {
    console.error("Error sending messages:", error);
    res.status(500).json({ error: "Failed to send messages" });
  }
};
