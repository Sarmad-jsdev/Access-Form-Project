import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Survey from "../models/Survey.js";
import Response from "../models/Response.js";

const router = express.Router();

// GET current logged in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE user survey
router.delete("/delete-survey/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "creator") {
      return res.status(403).json({ message: "Access denied" });
    }

    const survey = await Survey.findOne({
      _id: req.params.id,
      creator: req.user.id,
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    await Response.deleteMany({ survey: survey._id });
    await survey.deleteOne();

    res.json({ message: "Survey deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;