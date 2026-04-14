import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

import authRoutes from "../routes/authRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import creatorRoutes from "../routes/creatorRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import respondentRoutes from "../routes/respondantRoutes.js";

dotenv.config();

const app = express();

// ✅ Fix DB multiple connections (serverless)
let isConnected = false;
const connectDBOnce = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};
await connectDBOnce();

// Trust proxy
app.set("trust proxy", 1);

// ✅ SIMPLE CORS (Bearer token, no cookies)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/creator", creatorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/respondent", respondentRoutes); // ✅ fixed name

app.get("/", (req, res) => res.send("API running"));

export default app;
export const handler = serverless(app);