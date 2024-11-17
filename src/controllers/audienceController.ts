import { Request, Response } from "express";
import customerModel from "../models/customerModel";
import audienceSegmentModel from "../models/audienceSegmentModel";

const buildQuery = (conditions: any[]) => {
  if (conditions.length === 0) return {};

  const andConditions: any[] = [];
  const orConditions: any[] = [];

  conditions.forEach((condition) => {
    const { logic, field, operator, value } = condition;
    let queryCondition;

    switch (operator) {
      case ">":
        queryCondition = { [field]: { $gt: value } };
        break;
      case "<=":
        queryCondition = { [field]: { $lte: value } };
        break;
      case "==":
        queryCondition = { [field]: value };
        break;
      case "!=":
        queryCondition = { [field]: { $ne: value } };
        break;
      default:
        queryCondition = {};
    }

    if (logic === "OR") {
      orConditions.push(queryCondition);
    } else {
      andConditions.push(queryCondition);
    }
  });

  if (andConditions.length > 0 && orConditions.length > 0) {
    return { $and: [...andConditions, { $or: orConditions }] };
  } else if (andConditions.length > 0) {
    return { $and: andConditions };
  } else if (orConditions.length > 0) {
    return { $or: orConditions };
  }

  return {};
};

export const createAudienceSegment = async (req: Request, res: Response) => {
  try {
    const { name, conditions } = req.body;

    // Build the query dynamically
    const query = buildQuery(conditions);

    // Find matching customers
    const customers = await customerModel.find(query).select("_id");
    const customerIds = customers.map((customer) => customer._id);

    // Calculate the segment size
    const segmentSize = customerIds.length;

    const segment = new audienceSegmentModel({
      name,
      conditions,
      size: segmentSize,
      customerIds,
    });

    await segment.save();

    res.status(201).json(segment);
  } catch (error: any) {
    console.error("Error creating audience segment:", error);
    res.status(500).json({ message: error.message });
  }
};
export const getAudienceSegments = async (req: Request, res: Response) => {
  try {
    const segments = await audienceSegmentModel.find();
    res.status(200).json(segments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
