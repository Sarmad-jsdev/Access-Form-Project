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

app.set("trust proxy", 1);

// ✅ CORS CONFIGURATION FOR THIRD-PARTY COOKIES
app.use(cors({
  origin: function (origin, callback) {
    // Accept all Vercel domains + localhost
    if (!origin || 
        /^http:\/\/localhost/.test(origin) || 
        /^https:\/\/.*\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS denied"));
    }
  },
  credentials: true,  // ✅ MUST be true for cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
}));

// ✅ Handle preflight requests
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || 
        /^http:\/\/localhost/.test(origin) || 
        /^https:\/\/.*\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS denied"));
    }
  },
  credentials: true,
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
