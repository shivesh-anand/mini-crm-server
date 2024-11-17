import express from "express";
import { getAllCampaignStats } from "../controllers/campaignController";

const router = express.Router();

router.get("/campaigns", getAllCampaignStats);

export default router;
