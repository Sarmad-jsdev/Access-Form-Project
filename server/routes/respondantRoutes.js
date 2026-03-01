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

    res.status(200).json(survey);
  } catch (err) {
    console.error("Error fetching survey:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
====================================================
3️⃣ SUBMIT RESPONSE
Route: POST /api/respondent/submit-response/:id
====================================================
*/
router.post("/submit-response/:id", authMiddleware, async (req, res) => {
  try {
    const surveyId = req.params.id;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    const survey = await Survey.findById(surveyId);

    if (!survey || !survey.isActive) {
      return res.status(404).json({ message: "Survey not found or inactive" });
    }

    // 🔥 Convert questionId -> question text
    const formattedAnswers = answers.map((ans) => {
      const question = survey.questions.id(ans.questionId);

      if (!question) {
        throw new Error("Invalid question ID");
      }

      return {
        question: question.questionText, // save TEXT instead of ID
        answer: ans.answer,
      };
    });

    const newResponse = await Response.create({
      survey: surveyId,
      respondent: req.user.id,
      answers: formattedAnswers,
    });

    res.status(201).json({
      message: "Response submitted successfully",
      response: newResponse,
    });

  } catch (err) {
    console.error("Error submitting response:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;