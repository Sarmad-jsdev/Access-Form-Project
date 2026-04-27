import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../axiosConfig";
import toast from "react-hot-toast";
import { ClipboardList, ArrowLeft } from "lucide-react";
import DashboardLayout from "../Components/DashboardLayout";

const Respondent = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const messageRef = useRef(null);

  useEffect(() => {
    if (message && messageRef.current) messageRef.current.focus();
  }, [message]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await axiosInstance.get("/respondent/active-surveys");
        setSurveys(res.data || []);
      } catch {
        toast.error("Failed to load surveys");
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const handleChange = (q, value) => {
    setAnswers((prev) => ({ ...prev, [q._id]: value }));
    setErrors((prev) => ({ ...prev, [q._id]: "" }));
  };

  const validate = () => {
    const err = {};
    selectedSurvey.questions.forEach((q) => {
      const val = answers[q._id];
      if (val === undefined || val === "" || val === null || (Array.isArray(val) && val.length === 0)) {
        err[q._id] = "This field is required";
        return;
      }
      if (q.questionType === "email") {
        if (!/\S+@\S+\.\S+/.test(val)) err[q._id] = "Invalid email format";
      }
      if (q.questionType === "number") {
        if (isNaN(val)) err[q._id] = "Must be a number";
      }
    });
    setErrors(err);
    if (Object.keys(err).length > 0) { toast.error("Please fix errors"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    const formatted = selectedSurvey.questions.map((q) => ({
      questionText: q.questionText,
      answer: answers[q._id],
    }));

    try {
      setSubmitting(true);
      const res = await axiosInstance.post(`/respondent/survey/${selectedSurvey._id}/submit`, { answers: formatted });
      toast.success(res.data?.message || "Submitted successfully!");
      setMessage("Response submitted successfully!");
      setSelectedSurvey(null);
      setAnswers({});
      setErrors({});
    } catch (err) {
      const msg = err.response?.data?.message || "Submission failed";
      toast.error(msg);
      setMessage(msg);
      if (err.response?.status === 403) setSelectedSurvey(null);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Survey list view ─────────────────────────────────────── */
  if (!selectedSurvey) {
    return (
      <DashboardLayout title="Available Surveys">
        {loading ? (
          <p className="text-[var(--text-secondary)] text-sm">Loading surveys…</p>
        ) : (
          <>
            {message && (
              <div
                ref={messageRef}
                tabIndex="-1"
                className="mb-5 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm"
              >
                {message}
              </div>
            )}

            {surveys.length === 0 ? (
              <div className="text-center py-20 text-[var(--text-secondary)]">
                <ClipboardList size={36} className="mx-auto mb-3 opacity-30" />
                <p>No active surveys available right now.</p>
              </div>
            ) : (
              <div className="grid gap-4 max-w-2xl">
                {surveys.map((survey) => (
                  <div
                    key={survey._id}
                    className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5 hover:shadow-md transition"
                  >
                    <h2 className="text-base font-semibold text-[var(--text-primary)]">{survey.title}</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{survey.description}</p>
                    <button
                      onClick={() => { setSelectedSurvey(survey); setMessage(""); }}
                      className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
                      style={{ background: "var(--primary)" }}
                    >
                      Start Survey
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </DashboardLayout>
    );
  }

  /* ── Form view ──────────────────────────────────────────────── */
  return (
    <DashboardLayout title={selectedSurvey.title}>
      <div className="max-w-2xl">

        <button
          onClick={() => { setSelectedSurvey(null); setAnswers({}); setErrors({}); }}
          className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition"
        >
          <ArrowLeft size={15} /> Back to surveys
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedSurvey.questions.map((q, index) => (
            <div
              key={q._id}
              className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5"
            >
              <p className="font-semibold text-sm text-[var(--text-primary)] mb-3">
                {index + 1}. {q.questionText}
              </p>

              {errors[q._id] && (
                <p className="text-red-500 text-xs mb-2">{errors[q._id]}</p>
              )}

              {["text", "email", "number"].includes(q.questionType) && (
                <input
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm"
                  value={answers[q._id] || ""}
                  onChange={(e) => handleChange(q, e.target.value)}
                />
              )}

              {(q.questionType === "radio" || q.questionType === "checkbox") &&
                q.options?.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 mt-2 text-sm text-[var(--text-primary)]">
                    <input
                      type={q.questionType}
                      checked={
                        q.questionType === "checkbox"
                          ? (answers[q._id] || []).includes(opt)
                          : answers[q._id] === opt
                      }
                      onChange={() => {
                        if (q.questionType === "checkbox") {
                          const prev = answers[q._id] || [];
                          handleChange(q, prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]);
                        } else {
                          handleChange(q, opt);
                        }
                      }}
                    />
                    {opt}
                  </label>
                ))}

              {q.questionType === "dropdown" && (
                <select
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm"
                  value={answers[q._id] || ""}
                  onChange={(e) => handleChange(q, e.target.value)}
                >
                  <option value="">Select</option>
                  {q.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}
            </div>
          ))}

          <button
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition"
            style={{ background: "var(--primary)" }}
          >
            {submitting ? "Submitting…" : "Submit Survey"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Respondent;