import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Survey from "../models/Survey.js";
import Response from "../models/Response.js";

const router = express.Router();

// ✅ Get creator's own surveys
router.get("/my-surveys", authMiddleware, async (req, res) => {
  try {
    const surveys = await Survey.find({ creator: req.user.id });

    const totalSurveys = surveys.length;
    const activeSurveys = surveys.filter(s => s.isActive).length;

    const totalResponses = await Response.countDocuments({
      survey: { $in: surveys.map(s => s._id) }
    });

    res.json({
      surveys,
      stats: {
        totalSurveys,
        activeSurveys,
        totalResponses
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
})


// ✅ Create new survey
router.post("/create-survey", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "creator") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, questions } = req.body;

    const survey = await Survey.create({
      title,
      description,
      questions,
      creator: req.user.id,
    });

    res.status(201).json(survey);

  } catch (error) {
    console.error(error);
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

// ✅ Edit survey
router.put("/edit-survey/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "creator") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, questions, isActive } = req.body;

    const survey = await Survey.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.id },
      { title, description, questions, isActive },
      { new: true }
    );

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Preview survey (get by ID)
router.get("/survey/:id", authMiddleware, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get survey analytics
router.get("/survey-analytics/:id", authMiddleware, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    const responses = await Response.find({ survey: survey._id });

    res.json({
      surveyTitle: survey.title,
      totalResponses: responses.length,
      responses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
