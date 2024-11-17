import express from "express";
import { addOrder, getOrders } from "../controllers/orderController";

const router = express.Router();

router.post("/orders", addOrder);
router.get("/orders", getOrders);

export default router;
