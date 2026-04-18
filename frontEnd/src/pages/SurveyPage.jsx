import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const SurveyPage = () => {
  const { id } = useParams();
  const { user, loading } = useContext(AuthContext);

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // FETCH SURVEY
  // =========================
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axiosInstance.get(
          `/respondent/survey/${id}/fill`
        );
        setSurvey(res.data);
      } catch (err) {
        const msg =
          err.response?.data?.message || "Failed to load survey";

        toast.error(msg);

        if (err.response?.status === 403) {
          setSubmitted(true);
        }
      }
    };

    if (!loading && user) fetchSurvey();
  }, [user, loading, id]);

  const questions = useMemo(() => survey?.questions || [], [survey]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (q, value) => {
    setAnswers((prev) => ({
      ...prev,
      [q._id]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [q._id]: "",
    }));
  };

  // =========================
  // VALIDATION
  // =========================
  const validate = () => {
    const errors = {};

    questions.forEach((q) => {
      const val = answers[q._id];

      if (
        val === undefined ||
        val === "" ||
        val === null ||
        (Array.isArray(val) && val.length === 0)
      ) {
        errors[q._id] = "This field is required";
        return;
      }

      if (q.questionType === "email") {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(val)) {
          errors[q._id] = "Invalid email format";
        }
      }

      if (q.questionType === "number") {
        if (isNaN(val)) {
          errors[q._id] = "Must be a number";
        }
      }
    });

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix errors");
      return false;
    }

    return true;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitted) {
      return toast.error("You already submitted this survey");
    }

    if (submitting) return;

    if (!validate()) return;

    const formatted = questions.map((q) => ({
      questionId: q._id,
      questionText: q.questionText,
      answer: answers[q._id],
    }));

    try {
      setSubmitting(true);

      const res = await axiosInstance.post(
        `/respondent/survey/${id}/submit`,
        { answers: formatted }
      );

      toast.success(
        res.data?.message || "Survey submitted successfully!"
      );

      setSubmitted(true);
      setSurvey(null);
      setAnswers({});
      setFieldErrors({});
    } catch (err) {
      const msg =
        err.response?.data?.message || "Submission failed";

      toast.error(msg);

      if (err.response?.status === 403) {
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="p-8 text-[var(--text-secondary)]">
        Loading...
      </div>
    );
  }

  if (!survey && !submitted) {
    return (
      <div className="p-8 text-[var(--status-inactive-text)] font-semibold">
        Survey not found
      </div>
    );
  }

  // =========================
  // ALREADY SUBMITTED
  // =========================
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-[var(--bg-secondary)]">
        <h2 className="text-xl font-bold text-[var(--status-inactive-text)]">
          You have already submitted this survey
        </h2>
        <p className="text-[var(--text-secondary)] mt-2">
          Thank you for your response
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <main className="min-h-screen p-8 bg-[var(--bg-secondary)]">

      {/* HEADER */}
      <div className="max-w-3xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          {survey.title}
        </h1>

        {survey.description && (
          <p className="text-[var(--text-secondary)] mt-2">
            {survey.description}
          </p>
        )}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">

        {/* QUESTIONS */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q._id}
              className="p-5 rounded-xl bg-[var(--bg-primary)]
                         border border-[var(--border)] shadow"
            >
              <p className="font-semibold text-[var(--text-primary)] mb-2">
                {index + 1}. {q.questionText}
              </p>

              {/* ERROR */}
              {fieldErrors[q._id] && (
                <p className="text-[var(--status-inactive-text)] text-sm mb-2">
                  {fieldErrors[q._id]}
                </p>
              )}

              {/* TEXT INPUT */}
              {["text", "email", "number"].includes(q.questionType) && (
                <input
                  className="w-full p-2 rounded border border-[var(--border)]
                             bg-[var(--bg-secondary)]
                             text-[var(--text-primary)]"
                  value={answers[q._id] || ""}
                  onChange={(e) =>
                    handleChange(q, e.target.value)
                  }
                />
              )}

              {/* RADIO / CHECKBOX */}
              {(q.questionType === "radio" ||
                q.questionType === "checkbox") &&
                q.options?.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 mt-1 text-[var(--text-primary)]"
                  >
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

                          const updated = prev.includes(opt)
                            ? prev.filter((x) => x !== opt)
                            : [...prev, opt];

                          handleChange(q, updated);
                        } else {
                          handleChange(q, opt);
                        }
                      }}
                    />
                    {opt}
                  </label>
                ))}

              {/* DROPDOWN */}
              {q.questionType === "dropdown" && (
                <select
                  className="w-full p-2 rounded border border-[var(--border)]
                             bg-[var(--bg-secondary)]
                             text-[var(--text-primary)]"
                  value={answers[q._id] || ""}
                  onChange={(e) =>
                    handleChange(q, e.target.value)
                  }
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
        </div>

        {/* SUBMIT */}
        <button
          disabled={submitting}
          className="mt-6 px-6 py-2 rounded
                     bg-[var(--primary)]
                     text-[var(--text-on-primary)]
                     hover:opacity-[var(--btn-hover)]
                     disabled:opacity-50 transition"
        >
          {submitting ? "Submitting..." : "Submit Survey"}
        </button>
      </form>
    </main>
  );
};

export default SurveyPage;