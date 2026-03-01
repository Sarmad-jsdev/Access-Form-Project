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

// CORS setup for your frontend
app.use(cors({
  origin: "https://accessform-chi.vercel.app", // frontend URL
  credentials: true, // allow cookies to be sent
}));

// Preflight for all routes
app.options("*", cors());

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