import express from "express";
import Survey from "../models/Survey.js";
import Response from "../models/Response.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
====================================================
1️⃣ GET ALL ACTIVE SURVEYS
Route: GET /api/respondent/active-surveys
====================================================
*/
router.get("/active-surveys", authMiddleware, async (req, res) => {
  try {
    // Only allow respondents
    if (req.user.role !== "respondent") {
      return res.status(403).json({ message: "Access denied" });
    }

    const surveys = await Survey.find({ isActive: true });

    res.status(200).json(surveys);
  } catch (err) {
    console.error("Error fetching surveys:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
====================================================
2️⃣ GET SINGLE SURVEY
Route: GET /api/respondent/survey/:id
====================================================
*/
router.get("/survey/:id", authMiddleware, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey || !survey.isActive) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get survey for filling
router.get("/survey/:id/fill", authMiddleware, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey || !survey.isActive) {
      return res.status(404).json({ message: "Survey not found or inactive" });
    }

    // Prevent creator from filling own survey
    if (survey.creator.toString() === req.user.id) {
      return res.status(403).json({ message: "Creators cannot fill their own survey" });
    }

    // Prevent multiple submissions
    const existingResponse = await Response.findOne({
      survey: survey._id,
      respondent: req.user.id,
    });

    if (existingResponse) {
      return res.status(403).json({ message: "You have already submitted this survey" });
    }

    res.json(survey);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Submit survey response
router.post("/survey/:id/submit", authMiddleware, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey || !survey.isActive) {
      return res.status(404).json({ message: "Survey not found or inactive" });
    }

    if (survey.creator.toString() === req.user.id) {
      return res.status(403).json({ message: "Creators cannot submit their own survey" });
    }

    const existingResponse = await Response.findOne({
      survey: survey._id,
      respondent: req.user.id,
    });

    if (existingResponse) {
      return res.status(403).json({ message: "You have already submitted this survey" });
    }

    const { answers } = req.body; // array of { questionId, questionText/question, answer }

    const normalizedAnswers = Array.isArray(answers)
      ? answers.map((item) => ({
          questionId: item.questionId || undefined,
          questionText: item.questionText || item.question || "",
          question: item.question || item.questionText || "",
          answer: item.answer,
        }))
      : [];

    if (!normalizedAnswers.length) {
      return res.status(400).json({ message: "Answers are required" });
    }

    const response = await Response.create({
      survey: survey._id,
      respondent: req.user.id,
      answers: normalizedAnswers,
    });

    res.status(201).json({ message: "Response submitted successfully", response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/respondent/my-responses/:surveyId
router.get("/my-responses/:surveyId", authMiddleware, async (req, res) => {
  try {
    const response = await Response.findOne({
      survey: req.params.surveyId,
      respondent: req.user.id
    });

    res.json({ submitted: !!response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;