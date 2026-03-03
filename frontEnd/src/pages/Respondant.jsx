import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../axiosConfig";

const Respondent = () => {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const messageRef = useRef(null);

  // Focus message when it appears
  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.focus();
    }
  }, [message]);

  // Fetch active surveys
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await axiosInstance.get(
          `${API_BASE_URL}/api/respondent/active-surveys`,
          { withCredentials: true }
        );
        setSurveys(res.data);
      } catch (err) {
        console.error("Error fetching surveys:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const handleAnswerChange = (question, value, type) => {
    setAnswers((prev) => {
      const updated = { ...prev };
      if (type === "checkbox") {
        const current = updated[question._id] || [];
        updated[question._id] = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
      } else {
        updated[question._id] = value;
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSurvey) return;

    const formattedAnswers = selectedSurvey.questions.map((q) => ({
      questionText: q.questionText,
      answer:
        answers[q._id] ||
        (q.questionType === "checkbox" ? [] : ""),
    }));

    try {
      await axiosInstance.post(
        `${API_BASE_URL}/api/respondent/submit-response/${selectedSurvey._id}`,
        { answers: formattedAnswers },
        { withCredentials: true }
      );

      setMessage("Response submitted successfully!");
      setSelectedSurvey(null);
      setAnswers({});
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit response. Please try again.");
    }
  };

  if (loading)
    return <p className="p-8">Loading surveys...</p>;

  // --------------------------
  // SURVEY LIST VIEW
  // --------------------------
  if (!selectedSurvey) {
    return (
      <main className="p-8 min-h-screen bg-[var(--bg-secondary)]">
        <h1 className="text-3xl font-bold mb-6">
          Active Surveys
        </h1>

        {message && (
          <div
            ref={messageRef}
            tabIndex="-1"
            role="status"
            aria-live="polite"
            className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded focus:outline-none"
          >
            {message}
          </div>
        )}

        {surveys.length === 0 ? (
          <p>No active surveys available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
              <article
                key={survey._id}
                className="bg-white p-6 rounded-xl shadow border flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    {survey.title}
                  </h2>
                  <p className="text-gray-500">
                    {survey.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedSurvey(survey);
                    setMessage("");
                  }}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  Start Survey
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    );
  }

  // --------------------------
  // SURVEY FORM VIEW
  // --------------------------
  return (
    <main className="min-h-screen p-8 bg-[var(--bg-secondary)]">
      <button
        onClick={() => {
          setSelectedSurvey(null);
          setAnswers({});
        }}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
      >
        ← Back to Surveys
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto"
        noValidate
      >
        <h1 className="text-3xl font-bold mb-2">
          {selectedSurvey.title}
        </h1>
        <p className="text-gray-500 mb-6">
          {selectedSurvey.description}
        </p>

        {selectedSurvey.questions.map((q) => (
          <fieldset key={q._id} className="mb-6">
            <legend className="font-semibold mb-2">
              {q.questionText}
            </legend>

            {(q.questionType === "text" ||
              q.questionType === "email" ||
              q.questionType === "number") && (
              <input
                type={q.questionType}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
                value={answers[q._id] || ""}
                onChange={(e) =>
                  handleAnswerChange(
                    q,
                    e.target.value,
                    q.questionType
                  )
                }
              />
            )}

            {(q.questionType === "radio" ||
              q.questionType === "checkbox") &&
              q.options?.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-1">
                  <input
                    id={`${q._id}-${idx}`}
                    type={
                      q.questionType === "checkbox"
                        ? "checkbox"
                        : "radio"
                    }
                    name={q._id}
                    checked={
                      q.questionType === "checkbox"
                        ? (answers[q._id] || []).includes(opt)
                        : answers[q._id] === opt
                    }
                    onChange={() =>
                      handleAnswerChange(
                        q,
                        opt,
                        q.questionType
                      )
                    }
                  />
                  <label htmlFor={`${q._id}-${idx}`}>
                    {opt}
                  </label>
                </div>
              ))}

            {q.questionType === "dropdown" && (
              <select
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
                value={answers[q._id] || ""}
                onChange={(e) =>
                  handleAnswerChange(
                    q,
                    e.target.value,
                    "dropdown"
                  )
                }
              >
                <option value="">Select an option</option>
                {q.options?.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </fieldset>
        ))}

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg focus:ring-2 focus:ring-green-400"
        >
          Submit
        </button>
      </form>
    </main>
  );
};

export default Respondent;