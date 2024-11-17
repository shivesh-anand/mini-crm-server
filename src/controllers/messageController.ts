import { Request, Response } from "express";
import axios from "axios";
import audienceSegmentModel from "../models/audienceSegmentModel";
import customerModel from "../models/customerModel";
import communicationsLogModel from "../models/communicationsLogModel";

const DELIVERY_RECEIPT_API_URL = `${process.env.API_URL}/api/delivery-receipt`;

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
    console.error("Message body is missing or not a string");
    res.status(400).json({ message: "Message body is required" });
    return;
  }

  try {
    console.log("Fetching audience segment with ID:", audienceId);
    const audience = await audienceSegmentModel.findById(audienceId);
    if (!audience) {
      console.error("Audience not found:", audienceId);
      res.status(404).json({ message: "Audience not found" });
      return;
    }

    console.log("Fetching customers for audience:", audience.customerIds);
    const customers = await customerModel.find({
      _id: { $in: audience.customerIds },
    });

    if (customers.length === 0) {
      console.error("No customers found for this audience.");
    }

    console.log("Sending messages to customers:", customers);

    for (const customer of customers) {
      const message = `Hi ${customer.name}, ${messageBody}`;

      console.log(`Creating communication log for customer: ${customer.name}`);
      const log = await communicationsLogModel.create({
        audienceId,
        customerId: customer._id,
        customerName: customer.name,
        message,
        status: "PENDING",
      });

      console.log("Created communication log:", log);

      const { status } = await callDeliveryReceiptApi(log._id.toString());

      console.log(`Updating communication log with status: ${status}`);
      log.status = status;
      await log.save();

      console.log(`Communication log updated for customer: ${customer.name}`);
    }

    res.status(200).json({ message: "Messages sent to queued customers" });
  } catch (error) {
    console.error("Error sending messages:", error);
    res.status(500).json({ error: "Failed to send messages" });
  }
};
