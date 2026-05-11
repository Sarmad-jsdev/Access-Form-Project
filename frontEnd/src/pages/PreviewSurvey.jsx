import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../Components/DashboardLayout";

const PreviewSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const headingRef = useRef(null);

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

  useEffect(() => {
    if (survey && headingRef.current) headingRef.current.focus();
  }, [survey]);

  if (!survey) {
    return (
      <DashboardLayout title="Preview Survey">
        <p
          className="text-[var(--text-secondary)] text-sm"
          role="status"
          aria-live="polite"
        >
          Loading survey…
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Preview Survey">
      {/* Back button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/CreatorDashboard")}
          aria-label="Back to Dashboard"
          className="px-4 py-2 rounded-lg bg-[var(--primary)] flex items-center text-[var(--text-on-primary)] cursor-pointer text-sm"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Back to Dashboard
        </button>
      </div>

      {/* Main content */}

      <div className="max-w-2xl space-y-5">
        {/* Survey header card */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-6">
          <h1
            ref={headingRef}
            tabIndex="-1"
            id="preview-heading"
            className="text-xl font-bold text-[var(--text-primary)] outline-none"
          >
            {survey.title}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            {survey.description}
          </p>
        </div>

        {/* Questions (read-only preview) */}
        {survey.questions?.length > 0 ? (
          survey.questions.map((q, i) => (
            <div
              key={i}
              className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5"
            >
              {/* Question Title */}
              <label
                htmlFor={`question-${i}`}
                className="block font-semibold text-sm text-[var(--text-primary)] mb-3"
              >
                {i + 1}. {q.questionText}
              </label>

              {/* TEXT / EMAIL / DATE */}
              {(q.questionType === "text" ||
                q.questionType === "email" ||
                q.questionType === "date") && (
                <input
                  id={`question-${i}`}
                  type={q.questionType}
                  aria-label={q.questionText}
                  disabled
                  placeholder={`Enter ${q.questionType}`}
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm"
                />
              )}

              {/* TEXTAREA */}
              {q.questionType === "textarea" && (
                <textarea
                  id={`question-${i}`}
                  disabled
                  rows={4}
                  aria-label={`Textarea for question ${i + 1}`}
                  placeholder="Write your answer..."
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm resize-none"
                />
              )}

              {/* DROPDOWN */}
              {q.questionType === "dropdown" && (
                <select
                  id={`question-${i}`}
                  disabled
                  aria-label={`Dropdown for question ${i + 1}`}
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm"
                >
                  <option>Select option</option>

                  {q.options?.map((opt, j) => (
                    <option key={j}>{opt}</option>
                  ))}
                </select>
              )}

              {/* RADIO */}
              {q.questionType === "radio" && (
                <fieldset className="space-y-2">
                  <legend className="sr-only">{q.questionText}</legend>

                  {q.options?.map((opt, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-2 text-sm text-[var(--text-primary)]"
                      aria-label={opt}
                    >
                      <input
                        type="radio"
                        disabled
                        name={`question-${i}`}
                        className="accent-[var(--primary)]"
                      />
                      {opt}
                    </label>
                  ))}
                </fieldset>
              )}

              {/* RATING */}
              {q.questionType === "rating" && (
                <div
                  className="flex items-center gap-2"
                  role="radiogroup"
                  aria-label={`Rating question ${i + 1}`}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      disabled
                      aria-label={`Rate ${num} out of 5`}
                      className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)]"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">
            No questions found.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PreviewSurvey;
