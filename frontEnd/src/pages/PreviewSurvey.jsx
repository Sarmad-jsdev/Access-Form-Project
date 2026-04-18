import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";

const PreviewSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const headingRef = useRef(null);

  // =========================
  // FETCH SURVEY
  // =========================
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axiosInstance.get(`/creator/survey/${id}`);
        setSurvey(res.data);
      } catch (error) {
        console.error("Error fetching survey:", error);
      }
    };

    fetchSurvey();
  }, [id]);

  // =========================
  // FOCUS TITLE (A11Y)
  // =========================
  useEffect(() => {
    if (survey && headingRef.current) {
      headingRef.current.focus();
    }
  }, [survey]);

  // =========================
  // LOADING STATE
  // =========================
  if (!survey) {
    return (
      <div
        className="min-h-screen p-8 bg-[var(--bg-secondary)]"
        role="status"
        aria-live="polite"
      >
        <p className="text-[var(--text-primary)]">
          Loading survey...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-[var(--bg-secondary)] font-[var(--font-dyslexia)]">

      {/* =========================
          BACK BUTTON
      ========================= */}
      <button
        onClick={() => navigate("/creator-dashboard")}
        className="
          mb-6 px-4 py-2 rounded-lg
          bg-[var(--bg-primary)]
          text-[var(--text-primary)]
          border border-[var(--border)]
          hover:opacity-90
          focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
        "
      >
        ← Back to Dashboard
      </button>

      {/* =========================
          MAIN CARD
      ========================= */}
      <section
        className="
          bg-[var(--bg-primary)]
          p-8 rounded-xl shadow
          max-w-3xl mx-auto
          border border-[var(--border)]
        "
        aria-labelledby="preview-heading"
      >

        {/* TITLE */}
        <h1
          id="preview-heading"
          ref={headingRef}
          tabIndex="-1"
          className="
            text-3xl font-bold mb-2
            text-[var(--text-primary)]
            outline-none
          "
        >
          {survey.title}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-[var(--text-secondary)] mb-6">
          {survey.description}
        </p>

        {/* =========================
            QUESTIONS
        ========================= */}
        {survey.questions?.length > 0 ? (
          survey.questions.map((q, i) => (
            <div key={i} className="mb-8">

              {/* RADIO / CHECKBOX */}
              {(q.questionType === "radio" ||
                q.questionType === "checkbox") && (
                <fieldset
                  className="
                    border border-[var(--border)]
                    p-4 rounded-lg
                  "
                >
                  <legend className="font-semibold text-[var(--text-primary)] mb-3">
                    {q.questionText}
                  </legend>

                  {q.options?.map((opt, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-2 mb-2 text-[var(--text-primary)]"
                    >
                      <input
                        type={q.questionType}
                        disabled
                        className="accent-[var(--primary)]"
                      />
                      {opt}
                    </label>
                  ))}
                </fieldset>
              )}

              {/* DROPDOWN */}
              {q.questionType === "dropdown" && (
                <div>
                  <label className="block font-semibold mb-2 text-[var(--text-primary)]">
                    {q.questionText}
                  </label>

                  <select
                    disabled
                    className="
                      w-full p-2 rounded-lg
                      bg-[var(--bg-secondary)]
                      text-[var(--text-primary)]
                      border border-[var(--border)]
                    "
                  >
                    {q.options?.map((opt, i) => (
                      <option key={i}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* TEXT / NUMBER / EMAIL */}
              {q.questionType !== "radio" &&
                q.questionType !== "checkbox" &&
                q.questionType !== "dropdown" && (
                  <div>
                    <label className="block font-semibold mb-2 text-[var(--text-primary)]">
                      {q.questionText}
                    </label>

                    <input
                      type={q.questionType}
                      disabled
                      className="
                        w-full p-2 rounded-lg
                        bg-[var(--bg-secondary)]
                        text-[var(--text-primary)]
                        border border-[var(--border)]
                      "
                    />
                  </div>
                )}
            </div>
          ))
        ) : (
          <p className="text-[var(--text-secondary)]">
            No questions found in this survey.
          </p>
        )}
      </section>
    </main>
  );
};

export default PreviewSurvey;