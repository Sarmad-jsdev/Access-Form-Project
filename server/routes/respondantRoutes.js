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

    // Prevent multiple submissions
    const existingResponse = await Response.findOne({
      survey: survey._id,
      respondent: req.user.id,
    });

    if (existingResponse) {
      return res
        .status(403)
        .json({ message: "You have already submitted this survey" });
    }

    res.json(survey);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================================
// Submit survey response (FIXED)
// ================================
router.post("/survey/:id/submit", authMiddleware, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey || !survey.isActive) {
      return res.status(404).json({
        message: "Survey not found or inactive",
      });
    }

    // ❌ creator cannot submit own survey
    if (survey.creator.toString() === req.user.id) {
      return res.status(403).json({
        message: "Creators cannot submit their own survey",
      });
    }

    // ❌ already submitted check
    const existingResponse = await Response.findOne({
      survey: survey._id,
      respondent: req.user.id,
    });

    if (existingResponse) {
      return res.status(403).json({
        message: "You have already submitted this survey",
      });
    }

    // ================================
    // 1️⃣ GET ANSWERS FIRST
    // ================================
    const { answers } = req.body;

    const normalizedAnswers = Array.isArray(answers)
      ? answers.map((item) => ({
          questionId: item.questionId,
          questionText: item.questionText,
          questionType: item.questionType,
          answer: item.answer,
        }))
      : [];

    if (!normalizedAnswers.length) {
      return res.status(400).json({
        message: "Answers are required",
      });
    }

    // ================================
    // 2️⃣ VALIDATION AGAINST SURVEY
    // ================================
    for (const q of survey.questions) {
      const submitted = normalizedAnswers.find(
        (a) => a.questionText === q.questionText
      );

      if (!submitted) {
        return res.status(400).json({
          message: `Missing answer for ${q.questionText}`,
        });
      }

      const value = submitted.answer;

      // EMAIL VALIDATION
      if (q.questionType === "email") {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(value)) {
          return res.status(400).json({
            message: `Invalid email for ${q.questionText}`,
          });
        }
      }

      // NUMBER VALIDATION
      if (q.questionType === "number") {
        if (isNaN(value)) {
          return res.status(400).json({
            message: `${q.questionText} must be a number`,
          });
        }
      }

      // RATING VALIDATION (1-5)
      if (q.questionType === "rating") {
        const rating = Number(value);
        if (rating < 1 || rating > 5) {
          return res.status(400).json({
            message: `Rating must be between 1 and 5`,
          });
        }
      }

      // RADIO VALIDATION
      if (q.questionType === "radio") {
        if (!q.options.includes(value)) {
          return res.status(400).json({
            message: `Invalid option selected for ${q.questionText}`,
          });
        }
      }

      // DROPDOWN VALIDATION
      if (q.questionType === "dropdown") {
        if (!q.options.includes(value)) {
          return res.status(400).json({
            message: `Invalid dropdown value for ${q.questionText}`,
          });
        }
      }
    }

    // ================================
    // 3️⃣ SAVE RESPONSE
    // ================================
    const response = await Response.create({
      survey: survey._id,
      respondent: req.user.id,
      answers: normalizedAnswers,
    });

    return res.status(201).json({
      message: "Response submitted successfully",
      response,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

// GET /api/respondent/my-responses/:surveyId
router.get("/my-responses/:surveyId", authMiddleware, async (req, res) => {
  try {
    const response = await Response.findOne({
      survey: req.params.surveyId,
      respondent: req.user.id,
    });

    res.json({ submitted: !!response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
