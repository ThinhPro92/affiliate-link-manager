import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import { PORT } from "./config/dotenvConfig.js";
// Import Routes
import authRoutes from "./routes/auth.routes.js";
import linkRoutes from "./routes/link.routes.js";
import { redirectLink } from "./controllers/link.controller.js";
import campaignRoutes from "./routes/campaign.routes.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
  transports: ["websocket", "polling"],
});

app.use((req: any, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(cors());
app.use(helmet());

connectDB();

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private room`);
  });
});

app.get("/r/:code", redirectLink);
// 2. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api", linkRoutes);

app.get("/", (req, res) => {
  res.send("Affiliate Link Manager API is active!");
});

httpServer.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
