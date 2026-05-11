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
      if (
        val === undefined ||
        val === "" ||
        val === null ||
        (Array.isArray(val) && val.length === 0)
      ) {
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
    if (Object.keys(err).length > 0) {
      toast.error("Please fix errors");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    const formatted = selectedSurvey.questions.map((q) => ({
      questionId: q._id,
      questionText: q.questionText,
      questionType: q.questionType,
      answer: answers[q._id],
    }));

    try {
      setSubmitting(true);
      const res = await axiosInstance.post(
        `/respondent/survey/${selectedSurvey._id}/submit`,
        { answers: formatted },
      );
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
          <p className="text-[var(--text-secondary)] text-sm">
            Loading surveys…
          </p>
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
                    <h2 className="text-base font-semibold text-[var(--text-primary)]">
                      {survey.title}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {survey.description}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedSurvey(survey);
                        setMessage("");
                      }}
                      aria-label={`Start survey titled ${survey.title}`}
                      className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-on-primary)] cursor-pointer transition"
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
          aria-label="Back to surveys"
          onClick={() => {
            setSelectedSurvey(null);
            setAnswers({});
            setErrors({});
          }}
          className="px-4 py-2 my-4 rounded-lg bg-[var(--primary)] flex items-center text-[var(--text-on-primary)] cursor-pointer text-sm"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Back to surveys
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

              {/* TEXT */}
              {["text", "email", "number"].includes(q.questionType) && (
                <input
                  type={q.questionType}
                  aria-label={`Enter ${q.questionType} details`}
                  name="Enter Details"
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm"
                  value={answers[q._id] || ""}
                  onChange={(e) => handleChange(q, e.target.value)}
                />
              )}

              {/* TEXTAREA */}
              {q.questionType === "textarea" && (
                <textarea
                  rows={4}
                  aria-label="Enter detailed response"
                  name="Enter Details"
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm"
                  value={answers[q._id] || ""}
                  onChange={(e) => handleChange(q, e.target.value)}
                />
              )}

              {/* RATING */}
              {q.questionType === "rating" && (
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      aria-label={`Select rating ${num}`}
                      onClick={() => handleChange(q, num)}
                      className={`w-10 h-10 rounded-lg border text-sm cursor-pointer transition ${
                        answers[q._id] === num
                          ? "bg-[var(--primary)] text-[var(--text-on-primary)]"
                          : "bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}

              {q.questionType === "radio" &&
                q.options?.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 mt-2 text-sm text-[var(--text-primary)] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={q._id}
                      checked={answers[q._id] === opt}
                      onChange={() => handleChange(q, opt)}
                      aria-label={`Select option ${opt}`}
                    />
                    {opt}
                  </label>
                ))}

              {q.questionType === "dropdown" && (
                <select
                  aria-label="Select an option"
                    name="Select Option"  
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm"
                  value={answers[q._id] || ""}
                  onChange={(e) => handleChange(q, e.target.value)}
                >
                  <option value="">Select</option>
                  {q.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <button
            disabled={submitting}
            aria-label="Submit survey"
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-[var(--text-on-primary)] cursor-pointer disabled:opacity-50 transition"
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
