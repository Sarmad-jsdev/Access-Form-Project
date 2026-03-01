import React, { useState } from "react";
import axios from "axios";
import { PlusCircle, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateForm = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);

  // Add New Question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "text",
        options: [],
      },
    ]);
  };

  // Delete Question
  const deleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  // Handle Question Change
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // Add Option
  const addOption = (index) => {
    const updated = [...questions];
    updated[index].options.push("");
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  // Submit Form
  const handleSubmit = async () => {
    try {
      await axios.post(
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
      <h1 className="text-3xl font-bold mb-6">Create New Form</h1>

      {/* Form Settings */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <input
          type="text"
          placeholder="Form Title"
          className="w-full border p-3 rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Form Description"
          className="w-full border p-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Questions Section */}
      {questions.map((q, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow mb-4">
          <input
            type="text"
            placeholder="Question text"
            className="w-full border p-2 rounded mb-3"
            value={q.questionText}
            onChange={(e) =>
              handleQuestionChange(index, "questionText", e.target.value)
            }
          />

          <select
            className="border p-2 rounded mb-3"
            value={q.questionType}
            onChange={(e) =>
              handleQuestionChange(index, "questionType", e.target.value)
            }
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="radio">Radio</option>
            <option value="checkbox">Checkbox</option>
            <option value="dropdown">Dropdown</option>
          </select>

          {(q.questionType === "radio" ||
            q.questionType === "checkbox" ||
            q.questionType === "dropdown") && (
            <div>
              {q.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder="Option"
                  className="w-full border p-2 rounded mb-2"
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(index, i, e.target.value)
                  }
                />
              ))}

              <button
                onClick={() => addOption(index)}
                className="text-blue-600 text-sm"
              >
                + Add Option
              </button>
            </div>
          )}

          <button
            onClick={() => deleteQuestion(index)}
            className="text-red-600 mt-3 flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete Question
          </button>
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <PlusCircle size={18} /> Add Question
      </button>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Save Form
        </button>

        <button
          onClick={() => setPreviewMode(true)}
          className="bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Eye size={16} /> Preview
        </button>
      </div>
    </div>
  );
};

export default CreateForm;