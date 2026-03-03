import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { PlusCircle, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateForm = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);

  // Add new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", questionType: "text", options: [] },
    ]);
  };

  // Delete question
  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Handle question change
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // Add option
  const addOption = (index) => {
    const updated = [...questions];
    updated[index].options.push("");
    setQuestions(updated);
  };

  // Handle option change
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      await axiosInstance.post(
        `${API_BASE_URL}/api/creator/create-survey`,
        { title, description, questions },
        { withCredentials: true }
      );
      alert("Form created successfully!");
      navigate("/creator-dashboard");
    } catch (err) {
      alert("Error creating form");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[var(--bg-secondary)]">
      <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">
        Create New Form
      </h1>

      {/* Form Settings */}
      <section
        className="bg-[var(--bg-primary)] p-6 rounded-xl shadow mb-6"
        aria-labelledby="form-settings-header"
      >
        <h2 id="form-settings-header" className="sr-only">
          Form Settings
        </h2>

        <label className="block mb-3 font-semibold text-[var(--text-primary)]">
          Form Title
          <input
            type="text"
            placeholder="Form Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            aria-required="true"
            className="w-full border border-[var(--border)] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          />
        </label>

        <label className="block font-semibold text-[var(--text-primary)]">
          Form Description
          <textarea
            placeholder="Form Description"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            aria-required="true"
            className="w-full border border-[var(--border)] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          />
        </label>
      </section>

      {/* Questions Section */}
      <section aria-labelledby="questions-header">
        <h2 id="questions-header" className="sr-only">
          Questions
        </h2>

        {questions.map((q, index) => (
          <div
            key={index}
            className="bg-[var(--bg-primary)] p-6 rounded-xl shadow mb-4"
          >
            <label className="block mb-2 font-semibold text-[var(--text-primary)]">
              Question Text
              <input
                type="text"
                placeholder="Question text"
                value={q.questionText}
                onChange={(e) =>
                  handleQuestionChange(index, "questionText", e.target.value)
                }
                aria-required="true"
                required
                className="w-full border border-[var(--border)] p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
              />
            </label>

            <label className="block mb-3 font-semibold text-[var(--text-primary)]">
              Question Type
              <select
                value={q.questionType}
                onChange={(e) =>
                  handleQuestionChange(index, "questionType", e.target.value)
                }
                className="w-full border border-[var(--border)] p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                aria-label={`Select type for question ${index + 1}`}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
                <option value="dropdown">Dropdown</option>
              </select>
            </label>

            {(q.questionType === "radio" ||
              q.questionType === "checkbox" ||
              q.questionType === "dropdown") && (
              <div>
                {q.options.map((opt, i) => (
                  <label key={i} className="block mb-2">
                    <input
                      type="text"
                      placeholder="Option"
                      required
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(index, i, e.target.value)
                      }
                      aria-label={`Option ${i + 1} for question ${index + 1}`}
                      className="w-full border border-[var(--border)] p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                    />
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(index)}
                  className="text-blue-600 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded inline-flex items-center gap-1"
                  aria-label={`Add option to question ${index + 1}`}
                >
                  <PlusCircle size={16} /> Add Option
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => deleteQuestion(index)}
              className="text-red-600 mt-3 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded"
              aria-label={`Delete question ${index + 1}`}
            >
              <Trash2 size={16} /> Delete Question
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          aria-label="Add new question"
        >
          <PlusCircle size={18} /> Add Question
        </button>
      </section>

      {/* Actions */}
      <div className="mt-6 flex gap-4 flex-wrap">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all"
          aria-label="Save form"
        >
          Save Form
        </button>

        <button
          type="button"
          onClick={() => setPreviewMode(true)}
          className="bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all"
          aria-label="Preview form"
        >
          <Eye size={16} /> Preview
        </button>
      </div>
    </div>
  );
};

export default CreateForm;