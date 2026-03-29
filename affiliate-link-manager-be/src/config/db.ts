import mongoose from "mongoose";
import { DB_URI } from "./dotenvConfig.js";

export const connectDB = async () => {
  try {
    if (!DB_URI) {
      throw new Error("DB_URI is not defined in .env file");
    }
    await mongoose.connect(DB_URI);
    console.log(" MongoDB Connected");
  } catch (err) {
    console.error(" DB Error:", err);
    process.exit(1);
  }
};
