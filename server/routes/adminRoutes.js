import { Router } from "express";
import User from "../models/User.js";
import Survey from "../models/Survey.js";
import Response from "../models/Response.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router();

// Admin dashboard stats
router.get("/dashboard", authMiddleware, adminMiddleware, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ status: "active" });
  const totalSurveys = await Survey.countDocuments();
  const totalResponses = await Response.countDocuments();

  const users = await User.find().select("-password");

  res.json({
    stats: { totalUsers, activeUsers, totalSurveys, totalResponses },
    users,
  });
});

// Block/unblock user
router.put("/block/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.status = user.status === "active" ? "blocked" : "active";
  await user.save();
  res.json({ message: "User status updated" });
});

export default router;