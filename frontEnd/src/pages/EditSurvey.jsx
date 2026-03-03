import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";

const EditSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [survey, setSurvey] = useState(null);
  const headingRef = useRef(null);

  // Fetch survey
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axiosInstance.get(
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

  // Move focus to heading after load (WCAG focus management)
  useEffect(() => {
    if (survey && headingRef.current) {
      headingRef.current.focus();
    }
  }, [survey]);

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(
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

  if (!survey) {
    return (
      <div
        className="p-8 min-h-screen bg-[var(--bg-secondary)]"
        role="status"
        aria-live="polite"
      >
        <p className="text-[var(--text-primary)]">Loading survey...</p>
      </div>
    );
  }

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[index][field] = value;
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  return (
    <main className="min-h-screen p-8 bg-[var(--bg-secondary)]">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/creator-dashboard")}
        className="mb-6 px-4 py-2 rounded-lg bg-[var(--bg-primary)] 
                   text-[var(--text-primary)] border border-[var(--border)] 
                   focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        aria-label="Back to Dashboard"
      >
        ← Back to Dashboard
      </button>

      <section
        className="bg-[var(--bg-primary)] p-8 rounded-xl shadow max-w-3xl mx-auto"
        aria-labelledby="edit-survey-heading"
      >
        <h1
          id="edit-survey-heading"
          ref={headingRef}
          tabIndex="-1"
          className="text-3xl font-bold mb-6 text-[var(--text-primary)] focus:outline-none"
        >
          Edit Survey
        </h1>

        {/* Survey Title */}
        <label className="block mb-4">
          <span className="block font-semibold text-[var(--text-primary)] mb-1">
            Survey Title
          </span>
          <input
            type="text"
            value={survey.title}
            onChange={(e) =>
              setSurvey({ ...survey, title: e.target.value })
            }
            className="w-full border border-[var(--border)] p-3 rounded 
                       bg-[var(--bg-secondary)] text-[var(--text-primary)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            aria-required="true"
          />
        </label>

        {/* Survey Description */}
        <label className="block mb-6">
          <span className="block font-semibold text-[var(--text-primary)] mb-1">
            Survey Description
          </span>
          <textarea
            value={survey.description}
            onChange={(e) =>
              setSurvey({ ...survey, description: e.target.value })
            }
            className="w-full border border-[var(--border)] p-3 rounded 
                       bg-[var(--bg-secondary)] text-[var(--text-primary)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            aria-required="true"
          />
        </label>

        {/* Questions */}
        <div aria-labelledby="questions-heading">
          <h2
            id="questions-heading"
            className="text-xl font-semibold mb-4 text-[var(--text-primary)]"
          >
            Questions
          </h2>

          {survey.questions?.map((q, index) => (
            <div
              key={index}
              className="mb-6 border-b border-[var(--border)] pb-4"
            >
              <label className="block mb-2">
                <span className="font-semibold text-[var(--text-primary)]">
                  Question {index + 1}
                </span>
                <input
                  type="text"
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionChange(
                      index,
                      "questionText",
                      e.target.value
                    )
                  }
                  className="w-full border border-[var(--border)] p-2 rounded mt-1
                             bg-[var(--bg-secondary)] text-[var(--text-primary)]
                             focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                  aria-label={`Edit text for question ${index + 1}`}
                />
              </label>

              {(q.questionType === "radio" ||
                q.questionType === "checkbox" ||
                q.questionType === "dropdown") &&
                q.options?.map((opt, i) => (
                  <label key={i} className="block mb-2">
                    <span className="sr-only">
                      Option {i + 1} for Question {index + 1}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...q.options];
                        newOptions[i] = e.target.value;
                        handleQuestionChange(index, "options", newOptions);
                      }}
                      className="w-full border border-[var(--border)] p-2 rounded
                                 bg-[var(--bg-secondary)] text-[var(--text-primary)]
                                 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                      aria-label={`Edit option ${i + 1} for question ${index + 1}`}
                    />
                  </label>
                ))}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleUpdate}
          className="mt-6 px-6 py-3 rounded-lg font-semibold 
                     bg-[var(--primary)] text-[var(--text-on-primary)]
                     focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]
                     transition active:scale-95"
          aria-label="Save survey changes"
        >
          Save Changes
        </button>
      </section>
    </main>
  );
};

export default EditSurvey;