import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [survey, setSurvey] = useState(null);

  // Fetch survey details
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/creator/survey/${id}`, {
          withCredentials: true,
        });
        setSurvey(res.data);
      } catch (error) {
        console.error("Error fetching survey:", error);
      }
    };

    fetchSurvey();
  }, [id]);

  // Update survey API call
  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/creator/edit-survey/${id}`,
        survey,
        { withCredentials: true }
      );
      alert("Survey updated successfully!");
      navigate("/creator-dashboard");
    } catch (error) {
      console.error("Error updating survey:", error);
      alert("Failed to update survey");
    }
  };

  // Safe loading check
  if (!survey) {
    return (
      <div className="p-8">
        <p>Loading survey...</p>
      </div>
    );
  }

  // Handle changes to a question
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[index][field] = value;
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  return (
    <div className="min-h-screen p-8 bg-[var(--bg-secondary)]">

      {/* Back button */}
      <button
        onClick={() => navigate("/creator-dashboard")}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Edit Survey</h1>

        {/* Survey Title */}
        <input
          type="text"
          value={survey.title}
          onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
          className="w-full border p-2 rounded mb-4"
          placeholder="Survey Title"
        />

        {/* Survey Description */}
        <textarea
          value={survey.description}
          onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
          className="w-full border p-2 rounded mb-4"
          placeholder="Survey Description"
        />

        {/* Questions */}
        {survey.questions?.map((q, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <label className="block font-semibold mb-1">Question {index + 1}</label>
            <input
              type="text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
              className="w-full border p-2 rounded mb-2"
              placeholder="Question text"
            />

            {/* Options for radio/checkbox/dropdown */}
            {(q.questionType === "radio" || q.questionType === "checkbox" || q.questionType === "dropdown") &&
              q.options?.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...q.options];
                    newOptions[i] = e.target.value;
                    handleQuestionChange(index, "options", newOptions);
                  }}
                  className="w-full border p-2 rounded mb-1"
                  placeholder={`Option ${i + 1}`}
                />
              ))}
          </div>
        ))}

        {/* Submit button */}
        <button
          onClick={handleUpdate}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditSurvey;