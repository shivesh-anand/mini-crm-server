import { Request, Response } from "express";
import audienceSegmentModel from "../models/audienceSegmentModel";
import communicationsLogModel from "../models/communicationsLogModel";

export const getAllCampaignStats = async (req: Request, res: Response) => {
  try {
    const audienceSegments = await audienceSegmentModel.find();

    const campaignStats = await Promise.all(
      audienceSegments.map(async (segment) => {
        const audienceSize = segment.customerIds?.length || 0;

        const logs = await communicationsLogModel.find({
          customerId: { $in: segment.customerIds },
        });

        let sentMessages = 0;
        let failedMessages = 0;
        let pendingMessages = 0;

        logs.forEach((log) => {
          if (log.status === "SENT") sentMessages++;
          if (log.status === "FAILED") failedMessages++;
          if (log.status === "PENDING") pendingMessages++;
        });

        const totalMessages = sentMessages + failedMessages + pendingMessages;

        return {
          segmentId: segment._id,
          segmentName: segment.name,
          audienceSize,
          sentMessages,
          failedMessages,
          pendingMessages,
          totalMessages,
          createdAt: segment.createdAt,
        };
      })
    );

    campaignStats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.status(200).json(campaignStats);
  } catch (error) {
    console.error("Error fetching campaign stats:", error);
    res.status(500).json({ error: "Failed to fetch campaign stats" });
  }
};
