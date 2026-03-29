import dotenv from "dotenv";

dotenv.config();

export const HOST = process.env.HOST || "http://localhost";
export const PORT = process.env.PORT || "5000";
export const DB_URI = process.env.DB_URI || "";
export const JWT_SECRET =
  (process.env.JWT_SECRET as string) || "default_secret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
