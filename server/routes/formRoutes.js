import express from "express";
import Form from "../models/Form.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create new form
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    const form = await Form.create({
      title,
      description,
      fields,
      createdBy: req.user.id,
    });
    res.status(201).json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all forms for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user.id });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;