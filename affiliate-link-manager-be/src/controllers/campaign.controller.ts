import type { Response } from "express";
import Campaign from "../models/Campaign.js";
import Link from "../models/Link.js";

export const createCampaign = async (req: any, res: Response) => {
  try {
    const { name, description } = req.body;
    const newCampaign = await Campaign.create({
      name,
      description,
      userId: req.user.id,
    });
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ message: "Không thể tạo chiến dịch" });
  }
};

export const getMyCampaigns = async (req: any, res: Response) => {
  try {
    const campaigns = await Campaign.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy chiến dịch" });
  }
};

export const deleteCampaign = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    await Campaign.findOneAndDelete({ _id: id, userId: req.user.id });

    await Link.updateMany({ campaignId: id }, { campaignId: null });

    res.json({ message: "Đã xóa chiến dịch" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa chiến dịch" });
  }
};
