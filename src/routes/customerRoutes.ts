import express from "express";
import { addCustomer, getCustomers } from "../controllers/customerController";

const router = express.Router();

router.post("/customers", addCustomer);
router.get("/customers", getCustomers);

export default router;
