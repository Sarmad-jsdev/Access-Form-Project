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
        <p className="text-[var(--text-secondary)] text-sm" role="status" aria-live="polite">
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
            className="px-4 py-2 rounded-lg bg-[var(--primary)] flex items-center text-[var(--text-on-primary)] cursor-pointer text-sm"
          >
             <ArrowLeft size={15} /> Back to Dashboard
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
          <p className="text-sm text-[var(--text-secondary)] mt-2">{survey.description}</p>
        </div>

        {/* Questions (read-only) */}
        {survey.questions?.length > 0 ? (
          survey.questions.map((q, i) => (
            <div key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5">

              {(q.questionType === "radio" || q.questionType === "checkbox") ? (
                <fieldset className="border-none p-0 m-0">
                  <legend className="font-semibold text-sm text-[var(--text-primary)] mb-3">
                    {i + 1}. {q.questionText}
                  </legend>
                  {q.options?.map((opt, index) => (
                    <label key={index} className="flex items-center gap-2 mb-2 text-sm text-[var(--text-primary)]">
                      <input type={q.questionType} disabled className="accent-[var(--primary)]" />
                      {opt}
                    </label>
                  ))}
                </fieldset>
              ) : q.questionType === "dropdown" ? (
                <div>
                  <label className="block font-semibold text-sm text-[var(--text-primary)] mb-2">
                    {i + 1}. {q.questionText}
                  </label>
                  <select
                    disabled
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm"
                  >
                    {q.options?.map((opt, j) => <option key={j}>{opt}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-sm text-[var(--text-primary)] mb-2">
                    {i + 1}. {q.questionText}
                  </label>
                  <input
                    type={q.questionType}
                    disabled
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">No questions found.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PreviewSurvey;