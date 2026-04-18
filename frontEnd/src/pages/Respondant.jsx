import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../axiosConfig";
import toast from "react-hot-toast";

const Respondent = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const messageRef = useRef(null);

  // =========================
  // ACCESSIBILITY FOCUS
  // =========================
  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.focus();
    }
  }, [message]);

  // =========================
  // FETCH SURVEYS
  // =========================
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await axiosInstance.get("/respondent/active-surveys");
        setSurveys(res.data || []);
      } catch (err) {
        toast.error("Failed to load surveys");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (q, value) => {
    setAnswers((prev) => ({
      ...prev,
      [q._id]: value,
    }));

    // remove error instantly
    setErrors((prev) => ({
      ...prev,
      [q._id]: "",
    }));
  };

  // =========================
  // VALIDATION (LIKE CREATE FORM)
  // =========================
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

      // email validation
      if (q.questionType === "email") {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(val)) {
          err[q._id] = "Invalid email format";
        }
      }

      // number validation
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

  // =========================
  // SUBMIT
  // =========================
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

      const res = await axiosInstance.post(
        `/respondent/survey/${selectedSurvey._id}/submit`,
        { answers: formatted }
      );

      toast.success(res.data?.message || "Submitted successfully!");

      setMessage("Response submitted successfully!");
      setSelectedSurvey(null);
      setAnswers({});
      setErrors({});
    } catch (err) {
      const msg =
        err.response?.data?.message || "Submission failed";

      toast.error(msg);
      setMessage(msg);

      // 🚨 important: handle already submitted
      if (err.response?.status === 403) {
        setSelectedSurvey(null);
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
        Loading surveys...
      </div>
    );
  }

  // =========================
  // LIST VIEW
  // =========================
  if (!selectedSurvey) {
    return (
      <main className="min-h-screen p-8 bg-[var(--bg-secondary)]">

        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
          Active Surveys
        </h1>

        {message && (
          <div
            ref={messageRef}
            tabIndex="-1"
            className="mb-4 p-3 rounded border border-[var(--border)]
                       bg-[var(--bg-primary)] text-[var(--text-primary)]"
          >
            {message}
          </div>
        )}

        <div className="grid gap-4">
          {surveys.map((survey) => (
            <div
              key={survey._id}
              className="p-5 rounded-xl bg-[var(--bg-primary)]
                         border border-[var(--border)] shadow"
            >
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {survey.title}
              </h2>

              <p className="text-[var(--text-secondary)] mt-1">
                {survey.description}
              </p>

              <button
                onClick={() => {
                  setSelectedSurvey(survey);
                  setMessage("");
                }}
                className="mt-3 px-4 py-2 rounded
                           bg-[var(--primary)]
                           text-[var(--text-on-primary)]
                           hover:opacity-[var(--btn-hover)] transition"
              >
                Start Survey
              </button>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // =========================
  // FORM VIEW (PRO UI)
  // =========================
  return (
    <main className="min-h-screen p-8 bg-[var(--bg-secondary)]">

      {/* BACK */}
      <button
        onClick={() => {
          setSelectedSurvey(null);
          setAnswers({});
          setErrors({});
        }}
        className="mb-6 px-4 py-2 rounded-lg
                   bg-[var(--bg-primary)]
                   border border-[var(--border)]
                   text-[var(--text-primary)]
                   hover:opacity-[var(--btn-hover)]"
      >
        ← Back
      </button>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
          {selectedSurvey.title}
        </h1>

        {/* QUESTIONS AS CARDS */}
        <div className="space-y-4">
          {selectedSurvey.questions.map((q, index) => (
            <div
              key={q._id}
              className="p-5 rounded-xl bg-[var(--bg-primary)]
                         border border-[var(--border)] shadow"
            >
              <p className="font-semibold text-[var(--text-primary)] mb-2">
                {index + 1}. {q.questionText}
              </p>

              {/* ERROR */}
              {errors[q._id] && (
                <p className="text-[var(--status-inactive-text)] text-sm mb-2">
                  {errors[q._id]}
                </p>
              )}

              {/* TEXT */}
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

export default Respondent;