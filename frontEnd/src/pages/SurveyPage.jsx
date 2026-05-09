import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../Components/DashboardLayout";

const SurveyPage = () => {
  const { id } = useParams();
  const { user, loading } = useContext(AuthContext);

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axiosInstance.get(`/respondent/survey/${id}/fill`);
        setSurvey(res.data);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load survey";
        toast.error(msg);

        if (err.response?.status === 403) {
          setSubmitted(true);
        }
      }
    };

    if (!loading && user) fetchSurvey();
  }, [user, loading, id]);

  // ================= CHANGE =================
  const handleChange = (q, value) => {
    setAnswers((prev) => ({ ...prev, [q._id]: value }));
    setErrors((prev) => ({ ...prev, [q._id]: "" }));
  };

  // ================= VALIDATION =================
  const validate = () => {
    const err = {};

    survey.questions.forEach((q) => {
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
        if (!/\S+@\S+\.\S+/.test(val)) {
          err[q._id] = "Invalid email format";
        }
      }

      if (q.questionType === "number") {
        if (isNaN(val)) {
          err[q._id] = "Must be a number";
        }
      }
    });

    setErrors(err);

    if (Object.keys(err).length > 0) {
      toast.error("Please fix errors");
      return false;
    }

    return true;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitted) {
      return toast.error("Already submitted");
    }

    if (submitting) return;

    if (!validate()) return;

    const formatted = survey.questions.map((q) => ({
      questionId: q._id,
      questionText: q.questionText,
      questionType: q.questionType,
      answer: answers[q._id],
    }));

    try {
      setSubmitting(true);

      const res = await axiosInstance.post(`/respondent/survey/${id}/submit`, {
        answers: formatted,
      });

      toast.success(res.data?.message || "Submitted successfully!");
      setSubmitted(true);
      setSurvey(null);
      setAnswers({});
      setErrors({});
    } catch (err) {
      const msg = err.response?.data?.message || "Submission failed";
      toast.error(msg);

      if (err.response?.status === 403) {
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ================= STATES =================

  if (loading) {
    return (
      <DashboardLayout title="">
        <p className="text-[var(--text-secondary)] text-sm">Loading...</p>
      </DashboardLayout>
    );
  }

  if (!survey && !submitted) {
    return (
      <DashboardLayout title="">
        <p className="text-[var(--text-secondary)] text-sm">Survey not found</p>
      </DashboardLayout>
    );
  }

  if (submitted) {
    return (
      <DashboardLayout title="">
        <div className="text-center py-20">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            You already submitted this survey
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Thank you for your response
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ================= UI =================
  return (
    <DashboardLayout title={survey.title}>
      <div className="max-w-2xl">
        {/* DESCRIPTION */}
        {survey.description && (
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            {survey.description}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {survey.questions.map((q, index) => (
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

              {/* TEXT / EMAIL / NUMBER */}
              {["text", "email", "number"].includes(q.questionType) && (
                <input
                  type={q.questionType}
                  className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm"
                  value={answers[q._id] || ""}
                  onChange={(e) => handleChange(q, e.target.value)}
                />
              )}

              {/* TEXTAREA */}
              {q.questionType === "textarea" && (
                <textarea
                  rows={4}
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

              {/* RADIO */}
              {q.questionType === "radio" &&
                q.options?.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 mt-2 text-sm text-[var(--text-primary)]"
                  >
                    <input
                      type="radio"
                      name={q._id}
                      checked={answers[q._id] === opt}
                      onChange={() => handleChange(q, opt)}
                    />
                    {opt}
                  </label>
                ))}

              {/* DROPDOWN */}
              {q.questionType === "dropdown" && (
                <select
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

          {/* SUBMIT */}
          <button
            disabled={submitting}
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

export default SurveyPage;
