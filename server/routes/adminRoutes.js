import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Survey from "../models/Survey.js";
import Response from "../models/Response.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router();

/* ───────────────────────────────
   ADMIN DASHBOARD
─────────────────────────────── */
router.get("/dashboard", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });
    const totalSurveys = await Survey.countDocuments();
    const totalResponses = await Response.countDocuments();

    const users = await User.find({ role: { $ne: "admin" } }).select("-password");

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalSurveys,
        totalResponses,
      },
      users,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ───────────────────────────────
   BLOCK / UNBLOCK USER (TOGGLE)
─────────────────────────────── */
router.put("/block/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot be modified" });
    }

    user.status = user.status === "active" ? "blocked" : "active";

    await user.save();

    res.json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("BLOCK ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ───────────────────────────────
   DELETE USER 
─────────────────────────────── */
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role === "admin") {
        return res.status(403).json({ message: "Admin cannot be deleted" });
      }

      await User.findByIdAndDelete(id);

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("DELETE ERROR:", error);
      res.status(500).json({ message: "Server error while deleting user" });
    }
  },
);




router.get(
  "/surveys",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const surveys = await Survey.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

      res.json(surveys);
    } catch (error) {
      console.error("GET SURVEYS ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.get(
  "/surveys/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid survey ID" });
      }

      const survey = await Survey.findById(id).populate(
        "createdBy",
        "name email"
      );

      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }

      res.json(survey);
    } catch (error) {
      console.error("SURVEY PREVIEW ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
