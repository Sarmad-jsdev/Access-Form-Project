import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    survey: { type: mongoose.Schema.Types.ObjectId, ref: "Survey", required: true },
    respondent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        answer: { type: mongoose.Schema.Types.Mixed } // Can be string, array, etc.
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Response", responseSchema);