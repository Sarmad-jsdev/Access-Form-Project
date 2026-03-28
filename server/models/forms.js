import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  type: String,
  label: String,
  options: [String],
});

const formSchema = new mongoose.Schema({
  title: String,
  description: String,
  fields: [fieldSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  submissions: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Form", formSchema);