import { Request, Response } from "express";
import audienceSegmentModel from "../models/audienceSegmentModel";
import communicationsLogModel from "../models/communicationsLogModel";

export const getAllCampaignStats = async (req: Request, res: Response) => {
  try {
    const audienceSegments = await audienceSegmentModel.find();

    const campaignStats = await Promise.all(
      audienceSegments.map(async (segment) => {
        const audienceSize = segment.customerIds?.length || 0;

        const stats = await communicationsLogModel.aggregate([
          {
            $match: {
              customerId: { $in: segment.customerIds },
            },
          },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]);

        const sentMessages = stats.find((s) => s._id === "SENT")?.count || 0;
        const failedMessages =
          stats.find((s) => s._id === "FAILED")?.count || 0;
        const pendingMessages =
          stats.find((s) => s._id === "PENDING")?.count || 0;
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
