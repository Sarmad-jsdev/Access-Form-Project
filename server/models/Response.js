import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
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
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
        },

        questionText: {
          type: String,
          required: true,
        },

        questionType: {
          type: String,
          enum: [
            "text",
            "email",
            "number",
            "radio",
            "dropdown",
            "rating",
            "textarea",
          ],
          required: true,
        },

        answer: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Response", responseSchema);