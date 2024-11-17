import express from "express";
import {
  createAudienceSegment,
  getAudienceSegments,
} from "../controllers/audienceController";

const router = express.Router();

router.post("/audiences", createAudienceSegment);
router.get("/audiences", getAudienceSegments);

export default router;
