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

// ✅ WILDCARD CORS - Accept ANY Vercel domain + localhost
app.use(cors({
  origin: function (origin, callback) {
    // Accept these:
    // 1. No origin (curl, mobile apps, etc)
    // 2. localhost (development)
    // 3. ANY *.vercel.app domain (production + previews)
    
    if (!origin) {
      return callback(null, true);
    }

    // Check if it's localhost or vercel.app domain
    const isLocalhostOrVercel = 
      /^http:\/\/localhost(:\d+)?$/.test(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin);

    if (isLocalhostOrVercel) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS rejected origin: ${origin}`);
      callback(new Error("CORS: Origin not allowed - " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 24 hours
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
