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

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      // Allow localhost
      if (origin.includes("localhost")) {
        return callback(null, true);
      }

      // Allow ALL vercel domains
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Handle preflight requests
app.options("*", cors());

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