import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/dotenvConfig.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email này đã được đăng ký" });
    }

    const hashedPw = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPw,
    });

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error: any) {
    console.error("LỖI ĐĂNG KÝ:", error);

    res.status(500).json({
      message: error.message || "Lỗi hệ thống khi đăng ký",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ email và mật khẩu" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      email: user.email,
      name: user.name,
    });
  } catch (error: any) {
    console.error("LỖI ĐĂNG NHẬP THỰC TẾ:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
