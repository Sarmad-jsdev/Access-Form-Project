import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true,
  },
  respondent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [
    {
      question: { type: String, required: true }, // 🔥 TEXT
      answer: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Response", responseSchema);