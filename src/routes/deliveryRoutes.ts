import express from "express";
import { deliveryReceipt } from "../controllers/deliveryController";

const router = express.Router();

router.post("/delivery-receipt/:logId", deliveryReceipt);

export default router;
