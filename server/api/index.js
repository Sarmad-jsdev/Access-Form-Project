import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
dotenv.config();
connectDB();

import authRoutes from "../routes/authRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import cookieParser from "cookie-parser";
import userRoutes from "../routes/userRoutes.js";
import creatorRoutes from "../routes/creatorRoutes.js";
import respondantRoutes from "../routes/respondantRoutes.js";


app.set("trust proxy", 1);

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "https://accessform-chi.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/creator", creatorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/respondent", respondantRoutes);

app.get("/", (req, res) => res.send("API running"));

export default app;
export const handler = serverless(app);