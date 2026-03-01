import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
dotenv.config();
connectDB();

import cookieParser from "cookie-parser";
import authRoutes from "../routes/authRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import creatorRoutes from "../routes/creatorRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import respondantRoutes from "../routes/respondantRoutes.js";

const app = express();

// Trust Vercel proxy
app.set("trust proxy", 1);

// CORS setup with environment variable
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://accessform-lhaa9ajk1-sarmad-jsdevs-projects.vercel.app",
  "http://localhost:3000", // for local development
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/creator", creatorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/respondent", respondantRoutes);

app.get("/", (req, res) => res.send("API running"));

export default app;
export const handler = serverless(app);
