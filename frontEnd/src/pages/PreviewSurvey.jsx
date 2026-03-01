import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


const PreviewSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [survey, setSurvey] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/creator/survey/${id}`,
          { withCredentials: true }
        );
        setSurvey(res.data);
      } catch (error) {
        console.error("Error fetching survey:", error);
      }
    };

    fetchSurvey();
  }, [id]);

  // 🔥 Important Safe Loading Check
  if (!survey) {
    return (
      <div className="p-8">
        <p>Loading survey...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[var(--bg-secondary)]">
      
      {/* 🔥 Back Button */}
  <button
    onClick={() => navigate("/creator-dashboard")}
    className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
  >
    ← Back to Dashboard
  </button>
      <div className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          {survey.title}
        </h1>

        <p className="text-gray-500 mb-6">
          {survey.description}
        </p>

        {/* ✅ Safe Mapping */}
        {survey.questions && survey.questions.length > 0 ? (
          survey.questions.map((q, i) => (
            <div key={i} className="mb-6">
              <label className="block font-semibold mb-2">
                {q.questionText}
              </label>

              {q.questionType === "text" && (
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  disabled
                />
              )}

              {q.questionType === "email" && (
                <input
                  type="email"
                  className="w-full border p-2 rounded"
                  disabled
                />
              )}

              {q.questionType === "number" && (
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  disabled
                />
              )}

              {(q.questionType === "radio" ||
                q.questionType === "checkbox" ||
                q.questionType === "dropdown") &&
                q.options?.map((opt, index) => (
                  <div key={index} className="flex items-center gap-2 mb-1">
                    <input
                      type={
                        q.questionType === "checkbox"
                          ? "checkbox"
                          : "radio"
                      }
                      disabled
                    />
                    <span>{opt}</span>
                  </div>
                ))}
            </div>
          ))
        ) : (
          <p>No questions found in this survey.</p>
        )}
      </div>
    </div>
  );
};

export default PreviewSurvey;