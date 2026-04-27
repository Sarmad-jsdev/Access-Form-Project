import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../Components/DashboardLayout";

const CreateForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const validate = () => {
    const err = {};
    if (!title.trim()) err.title = "Form title is required";
    if (!description.trim()) err.description = "Form description is required";
    if (questions.length === 0) err.questions = "At least 1 question required";
    questions.forEach((q, i) => {
      if (!q.questionText?.trim()) err[`q_${i}`] = "Question text is required";
      if (["radio", "checkbox", "dropdown"].includes(q.questionType) && (!q.options || q.options.length < 2))
        err[`q_opt_${i}`] = "At least 2 options required";
      q.options?.forEach((opt, oi) => {
        if (!opt.trim()) err[`q_opt_empty_${i}_${oi}`] = "Option cannot be empty";
      });
    });
    return err;
  };

  const addQuestion = () =>
    setQuestions((prev) => [...prev, { questionText: "", questionType: "text", options: [] }]);

  const deleteQuestion = (index) =>
    setQuestions((prev) => prev.filter((_, i) => i !== index));

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === "questionType" && (value === "text" || value === "number"))
        updated[index].options = [];
      return updated;
    });
  };

  const addOption = (qIndex) =>
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = { ...updated[qIndex], options: [...(updated[qIndex].options || []), ""] };
      return updated;
    });

  const handleOptionChange = (qIndex, oIndex, value) =>
    setQuestions((prev) => {
      const updated = [...prev];
      const options = [...(updated[qIndex].options || [])];
      options[oIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options };
      return updated;
    });

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) { toast.error("Please fix form errors"); return; }
    try {
      setLoading(true);
      const cleanedQuestions = questions.map((q) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options || [],
      }));
      const res = await axiosInstance.post("/creator/create-survey", { title, description, questions: cleanedQuestions });
      if (res.status === 200 || res.status === 201) {
        setShowOverlay(true);
        toast.success("Survey created 🎉");
        setTimeout(() => navigate("/CreatorDashboard"), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating survey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create New Survey">

      {showOverlay && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] p-6 rounded-2xl shadow border border-[var(--border)] text-center">
            <h2 className="font-bold text-lg mb-1" style={{ color: "var(--primary)" }}>Survey Created 🎉</h2>
            <p className="text-sm text-[var(--text-secondary)]">Redirecting…</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl space-y-5">

        {/* Title + description */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Survey title"
              className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Survey description"
              rows={3}
              className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, index) => (
          <div key={index} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Question {index + 1}
              </span>
              <button onClick={() => deleteQuestion(index)} className="text-red-500 hover:text-red-600 transition">
                <Trash2 size={15} />
              </button>
            </div>

            <input
              value={q.questionText}
              onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
              placeholder="Question text"
              className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm"
            />
            {errors[`q_${index}`] && <p className="text-red-500 text-xs">{errors[`q_${index}`]}</p>}

            <select
              value={q.questionType}
              onChange={(e) => handleQuestionChange(index, "questionType", e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
              <option value="dropdown">Dropdown</option>
            </select>

            {q.questionType !== "text" && q.questionType !== "number" && (
              <div className="space-y-1.5">
                {(q.options || []).map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={(e) => handleOptionChange(index, i, e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm"
                    placeholder={`Option ${i + 1}`}
                  />
                ))}
                {errors[`q_opt_${index}`] && <p className="text-red-500 text-xs">{errors[`q_opt_${index}`]}</p>}
                <button
                  onClick={() => addOption(index)}
                  className="text-xs font-medium mt-1"
                  style={{ color: "var(--primary)" }}
                >
                  + Add option
                </button>
              </div>
            )}
          </div>
        ))}

        {errors.questions && <p className="text-red-500 text-xs">{errors.questions}</p>}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={addQuestion}
            className="px-4 py-2.5 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text-primary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] transition"
          >
            + Add Question
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition"
            style={{ background: "var(--primary)" }}
          >
            {loading ? "Saving…" : "Save Survey"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateForm;