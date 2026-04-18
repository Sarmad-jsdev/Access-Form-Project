import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateForm = () => {
  const navigate = useNavigate();

  // ================= STATE =================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // ================= VALIDATION =================
  const validate = () => {
    const err = {};

    if (!title.trim()) err.title = "Form title is required";
    if (!description.trim()) err.description = "Form description is required";
    if (questions.length === 0) err.questions = "At least 1 question required";

    questions.forEach((q, i) => {
      if (!q.questionText?.trim()) {
        err[`q_${i}`] = "Question text is required";
      }

      if (
        (q.questionType === "radio" ||
          q.questionType === "checkbox" ||
          q.questionType === "dropdown") &&
        (!q.options || q.options.length < 2)
      ) {
        err[`q_opt_${i}`] = "At least 2 options required";
      }

      q.options?.forEach((opt, oi) => {
        if (!opt.trim()) {
          err[`q_opt_empty_${i}_${oi}`] = "Option cannot be empty";
        }
      });
    });

    return err;
  };

  // ================= QUESTIONS =================
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "",
        questionType: "text",
        options: [],
      },
    ]);
  };

  const deleteQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      if (field === "questionType" && (value === "text" || value === "number")) {
        updated[index].options = [];
      }

      return updated;
    });
  };

  const addOption = (qIndex) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = {
        ...updated[qIndex],
        options: [...(updated[qIndex].options || []), ""],
      };
      return updated;
    });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const options = [...(updated[qIndex].options || [])];
      options[oIndex] = value;

      updated[qIndex] = { ...updated[qIndex], options };
      return updated;
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix form errors");
      return;
    }

    try {
      setLoading(true);

      const cleanedQuestions = questions.map((q) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options || [],
      }));

      const res = await axiosInstance.post("/creator/create-survey", {
        title,
        description,
        questions: cleanedQuestions,
      });

      if (res.status === 200 || res.status === 201) {
        setShowOverlay(true);
        toast.success("Survey created 🎉");

        setTimeout(() => navigate("/creator-dashboard"), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating survey");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen p-8 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-[var(--font-dyslexia)]">

      {/* OVERLAY */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow border border-[var(--border)] text-center">
            <h2 className="text-[var(--primary)] font-bold text-lg">
              Survey Created 🎉
            </h2>
            <p className="text-[var(--text-secondary)]">Redirecting...</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Create New Survey
        </h1>

        <button
          onClick={() => navigate("/creator-dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] hover:opacity-[var(--btn-hover)] transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>

      {/* TITLE + DESCRIPTION */}
      <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border)] mb-6">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Survey title"
          className="w-full p-3 mb-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        />
        {errors.title && <p className="text-[var(--status-inactive-text)]">{errors.title}</p>}

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Survey description"
          className="w-full p-3 mt-3 rounded bg-[var(--bg-secondary)] border border-[var(--border)] outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        />
        {errors.description && <p className="text-[var(--status-inactive-text)]">{errors.description}</p>}

      </div>

      {/* QUESTIONS */}
      {questions.map((q, index) => (
        <div
          key={index}
          className="bg-[var(--bg-primary)] p-5 rounded-xl border border-[var(--border)] mb-4"
        >

          <input
            value={q.questionText}
            onChange={(e) =>
              handleQuestionChange(index, "questionText", e.target.value)
            }
            placeholder="Question"
            className="w-full p-2 mb-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded"
          />

          <select
            value={q.questionType}
            onChange={(e) =>
              handleQuestionChange(index, "questionType", e.target.value)
            }
            className="w-full p-2 mb-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="radio">Radio</option>
            <option value="checkbox">Checkbox</option>
            <option value="dropdown">Dropdown</option>
          </select>

          {/* OPTIONS */}
          {(q.questionType !== "text" && q.questionType !== "number") &&
            (q.options || []).map((opt, i) => (
              <input
                key={i}
                value={opt}
                onChange={(e) =>
                  handleOptionChange(index, i, e.target.value)
                }
                className="w-full p-2 mb-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded"
                placeholder="Option"
              />
            ))}

          {(q.questionType !== "text" && q.questionType !== "number") && (
            <button
              onClick={() => addOption(index)}
              className="text-[var(--primary)] mt-2"
            >
              + Add Option
            </button>
          )}

          <button
            onClick={() => deleteQuestion(index)}
            className="flex items-center gap-1 mt-3 text-[var(--status-inactive-text)] cursor-pointer"
          >
            <Trash2 size={14} /> Delete
          </button>

        </div>
      ))}

      {/* ACTIONS */}
      <button
        onClick={addQuestion}
        className="bg-[var(--primary)] text-[var(--text-on-primary)] px-4 py-2 rounded mr-3 hover:bg-[var(--primary-dark)] cursor-pointer transition"
      >
        + Add Question
      </button>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-[var(--primary-dark)] text-[var(--text-on-primary)] px-6 py-2 rounded disabled:opacity-50 cursor-pointer transition"
      >
        {loading ? "Saving..." : "Save Survey"}
      </button>
    </div>
  );
};

export default CreateForm;