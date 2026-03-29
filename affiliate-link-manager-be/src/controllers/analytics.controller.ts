import type { Request, Response } from "express";
import mongoose from "mongoose";
import Link from "../models/Link.js";
import Click from "../models/Click.js";

export const getStats = async (req: any, res: Response) => {
  const { id } = req.params;

  const linkInfo = await Link.findById(id);
  if (!linkInfo)
    return res.status(404).json({ message: "Link không tìm thấy" });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const clicksByDay = await Click.aggregate([
    {
      $match: {
        linkId: new mongoose.Types.ObjectId(id),
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    title: linkInfo.title,
    totalClicks: linkInfo.totalClicks,
    history: clicksByDay,
  });
};

export const getDashboardSummary = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const links = await Link.find({ userId, isDeleted: false });
    const linkIds = links.map((l) => l._id);

    const totalLinks = links.length;
    const totalClicks = links.reduce(
      (sum, link) => sum + (link.totalClicks || 0),
      0,
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clicksToday = await Click.countDocuments({
      linkId: { $in: linkIds },
      createdAt: { $gte: today },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const chartData = await Click.aggregate([
      {
        $match: {
          linkId: { $in: linkIds },
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topLinks = await Link.find({ userId, isDeleted: false })
      .sort({ totalClicks: -1 })
      .limit(5)
      .select("title shortCode totalClicks");

    const sourceStats = await Click.aggregate([
      { $match: { linkId: { $in: linkIds } } },
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const deviceStats = await Click.aggregate([
      { $match: { linkId: { $in: linkIds } } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalLinks,
      totalClicks,
      clicksToday,
      chartData,
      topLinks,
      sourceStats:
        sourceStats.length > 0 ? sourceStats : [{ _id: "Trực tiếp", count: 0 }],
      deviceStats:
        deviceStats.length > 0 ? deviceStats : [{ _id: "Máy tính", count: 0 }],
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy thống kê tổng quát" });
  }
};
