import type { Request, Response } from "express";
import { nanoid } from "nanoid";
import Link from "../models/Link.js";
import Click from "../models/Click.js";
import { UAParser } from "ua-parser-js";
import axios from "axios";
import mongoose from "mongoose";
export const createLink = async (req: any, res: Response) => {
  try {
    const { title, originalUrl, fallbackUrl, campaignId } = req.body;
    const shortCode = nanoid(6);

    const newLink = await Link.create({
      title,
      originalUrl,
      fallbackUrl: fallbackUrl || "",
      campaignId,
      shortCode,
      userId: req.user.id,
      totalClicks: 0,
    });

    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ message: "Không thể tạo link" });
  }
};
export const getMyLinks = async (req: any, res: Response) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const userId = req.user.id;

    const query: any = {
      userId: userId,
      isDeleted: false,
    };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const [links, total] = await Promise.all([
      Link.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit)),
      Link.countDocuments(query),
    ]);

    res.json({
      links,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateLink = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, originalUrl, fallbackUrl, campaignId } = req.body;

    const link = await Link.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, originalUrl, fallbackUrl, campaignId },
      { new: true },
    );

    if (!link) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy link hoặc bạn không có quyền" });
    }

    res.json(link);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi cập nhật" });
  }
};

export const softDeleteLink = async (req: any, res: Response) => {
  await Link.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { isDeleted: true, deletedAt: new Date() },
  );
  res.json({ message: "Đã chuyển vào thùng rác" });
};
export const getTrashLinks = async (req: any, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = {
      userId: new mongoose.Types.ObjectId(req.user.id),
      isDeleted: true,
    };

    const [links, total] = await Promise.all([
      Link.find(query)
        .sort({ deletedAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit)),
      Link.countDocuments(query),
    ]);

    res.json({
      links,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thùng rác" });
  }
};
export const restoreLink = async (req: any, res: Response) => {
  await Link.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { isDeleted: false, deletedAt: null },
  );
  res.json({ message: "Đã khôi phục" });
};

export const redirectLink = async (req: any, res: Response) => {
  const { code } = req.params;
  const link = await Link.findOne({ shortCode: code });
  if (!link) return res.status(404).send("Link không tồn tại");
  const targetUrl =
    link.status === "broken" && link.fallbackUrl
      ? link.fallbackUrl
      : link.originalUrl;
  const parser = new UAParser(req.headers["user-agent"]);
  const deviceType = parser.getDevice().type || "desktop";

  const referer = req.headers["referer"] || "Direct";
  let source = "Other";
  if (referer.includes("facebook.com") || referer.includes("fb.me"))
    source = "Facebook";
  else if (referer.includes("youtube.com")) source = "Youtube";
  else if (referer.includes("t.co") || referer.includes("twitter.com"))
    source = "X/Twitter";
  else if (referer === "Direct") source = "Direct";

  const clickData = {
    linkId: link._id,
    ip: req.ip,
    device: deviceType,
    source: source,
    userAgent: req.headers["user-agent"],
  };

  await Promise.all([
    Click.create(clickData),
    Link.findByIdAndUpdate(link._id, { $inc: { totalClicks: 1 } }),
  ]);

  if (req.io) {
    req.io.to(link.userId.toString()).emit("linkClicked", {
      linkId: link._id,
      newTotalClicks: (link.totalClicks || 0) + 1,
    });
  }

  return res.redirect(targetUrl);
};

export const deleteLinkPermanently = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const link = await Link.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!link) return res.status(404).json({ message: "Không tìm thấy link" });

    await Click.deleteMany({ linkId: id });

    res.json({ message: "Đã xóa vĩnh viễn liên kết và dữ liệu liên quan" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa vĩnh viễn" });
  }
};
export const checkLinkHealth = async (req: any, res: Response) => {
  try {
    const links = await Link.find({ userId: req.user.id, isDeleted: false });

    const results = await Promise.all(
      links.map(async (link) => {
        let currentStatus: "active" | "broken" = "active";

        try {
          const response = await axios.head(link.originalUrl, {
            timeout: 5000,
          });
          currentStatus =
            response.status >= 200 && response.status < 400
              ? "active"
              : "broken";
        } catch (err) {
          try {
            const responseGet = await axios.get(link.originalUrl, {
              timeout: 5000,
            });
            currentStatus = responseGet.status === 200 ? "active" : "broken";
          } catch (e) {
            currentStatus = "broken";
          }
        }

        if (link.status !== currentStatus) {
          await Link.findByIdAndUpdate(link._id, { status: currentStatus });
        }

        return { id: link._id, status: currentStatus };
      }),
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi kiểm tra sức khỏe link" });
  }
};
export const getStats = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const linkInfo = await Link.findOne({ _id: id, userId });

    if (!linkInfo) {
      return res.status(404).json({
        message: "Link không tìm thấy hoặc quyền truy cập bị từ chối",
      });
    }

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
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thống kê chi tiết" });
  }
};
