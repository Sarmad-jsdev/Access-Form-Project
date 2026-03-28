import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";

const PreviewSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const headingRef = useRef(null);

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

  // Focus heading when survey loads
  useEffect(() => {
    if (survey && headingRef.current) {
      headingRef.current.focus();
    }
  }, [survey]);

  if (!survey) {
    return (
      <div
        className="min-h-screen p-8 bg-[var(--bg-secondary)]"
        role="status"
        aria-live="polite"
      >
        <p className="text-[var(--text-primary)]">Loading survey...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-[var(--bg-secondary)]">
      
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/creator-dashboard")}
        className="mb-6 px-4 py-2 rounded-lg 
                   bg-[var(--bg-primary)] 
                   text-[var(--text-primary)] 
                   border border-[var(--border)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        aria-label="Back to Dashboard"
      >
        ← Back to Dashboard
      </button>

      <section
        className="bg-[var(--bg-primary)] p-8 rounded-xl shadow max-w-3xl mx-auto"
        aria-labelledby="preview-heading"
      >
        <h1
          id="preview-heading"
          ref={headingRef}
          tabIndex="-1"
          className="text-3xl font-bold mb-2 text-[var(--text-primary)] focus:outline-none"
        >
          {survey.title}
        </h1>

        <p className="text-[var(--text-secondary)] mb-6">
          {survey.description}
        </p>

        {/* Questions */}
        {survey.questions && survey.questions.length > 0 ? (
          survey.questions.map((q, i) => (
            <div key={i} className="mb-8">

              {/* Use fieldset for grouped inputs */}
              {(q.questionType === "radio" ||
                q.questionType === "checkbox") ? (
                <fieldset className="border border-[var(--border)] p-4 rounded">
                  <legend className="font-semibold text-[var(--text-primary)] mb-3">
                    {q.questionText}
                  </legend>

                  {q.options?.map((opt, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type={q.questionType}
                        disabled
                        aria-disabled="true"
                        className="focus:ring-2 focus:ring-[var(--focus-ring)]"
                      />
                      <span className="text-[var(--text-primary)]">
                        {opt}
                      </span>
                    </div>
                  ))}
                </fieldset>
              ) : q.questionType === "dropdown" ? (
                <div>
                  <label
                    className="block font-semibold mb-2 text-[var(--text-primary)]"
                  >
                    {q.questionText}
                  </label>

                  <select
                    disabled
                    aria-disabled="true"
                    className="w-full border border-[var(--border)] p-2 rounded
                               bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  >
                    {q.options?.map((enyu, index) => (
                      <option key={index}>{enyu}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label
                    className="block font-semibold mb-2 text-[var(--text-primary)]"
                  >
                    {q.questionText}
                  </label>

                  <input
                    type={q.questionType}
                    disabled
                    aria-disabled="true"
                    className="w-full border border-[var(--border)] p-2 rounded
                               bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p
            className="text-[var(--text-secondary)]"
            role="status"
            aria-live="polite"
          >
            No questions found in this survey.
          </p>
        )}
      </section>
    </main>
  );
};

export default PreviewSurvey;