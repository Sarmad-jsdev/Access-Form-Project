import { Router } from "express";
import User from "../models/User.js";
import Survey from "../models/Survey.js";
import Response from "../models/Response.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // verify token
const router = Router();

// Only admin access
const verifyAdmin = [authMiddleware, async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
}];

router.get("/dashboard", verifyAdmin, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ status: "active" });
  const totalSurveys = await Survey.countDocuments();
  const totalResponses = await Response.countDocuments();
  const users = await User.find().select("-password");
  res.json({ stats: { totalUsers, activeUsers, totalSurveys, totalResponses }, users });
});

router.put("/block/:id", verifyAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  user.status = user.status === "active" ? "blocked" : "active";
  await user.save();
  res.json({ message: "User status updated" });
});

export default router;