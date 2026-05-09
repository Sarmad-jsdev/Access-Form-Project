import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    questions: [
      {
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
            "textarea",
            "rating",
          ],
          default: "text",
        },

        options: [String],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Survey", surveySchema);