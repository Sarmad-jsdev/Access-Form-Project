import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
    questions: [
      {
        questionText: { type: String, required: true },
        questionType: { type: String, enum: ["text", "radio", "checkbox"], default: "text" },
        options: [String] // Only for radio/checkbox
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Survey", surveySchema);