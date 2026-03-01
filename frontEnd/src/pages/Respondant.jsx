import React, { useEffect, useState } from "react";
import axios from "axios";

const Respondent = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all active surveys
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/respondent/active-surveys`, {
          withCredentials: true,
        });
        setSurveys(res.data);
      } catch (err) {
        console.error("Error fetching surveys:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  // Handle answer change
  const handleAnswerChange = (question, value, type) => {
    setAnswers((prev) => {
      const updated = { ...prev };
      if (type === "checkbox") {
        // Toggle checkbox option
        const current = updated[question._id] || [];
        if (current.includes(value)) {
          updated[question._id] = current.filter((v) => v !== value);
        } else {
          updated[question._id] = [...current, value];
        }
      } else {
        updated[question._id] = value;
      }
      return updated;
    });
  };

  // Submit response
  const handleSubmit = async () => {
  if (!selectedSurvey) return;

  // Format answers as an array of objects
  const formattedAnswers = selectedSurvey.questions.map((q) => ({
    questionText: q.questionText, // must match survey question text
    answer: answers[q._id] || (q.questionType === "checkbox" ? [] : ""),
  }));

  try {
    await axios.post(
      `${API_BASE_URL}/api/respondent/submit-response/${selectedSurvey._id}`,
      { answers: formattedAnswers },
      { withCredentials: true } // JWT cookie is sent
    );
    alert("Response submitted successfully!");
    setSelectedSurvey(null);
    setAnswers({});
  } catch (err) {
    console.error("Error submitting response:", err);
    alert("Failed to submit response. Check console for details.");
  }
};

  if (loading) return <p className="p-8">Loading surveys...</p>;

  if (!selectedSurvey) {
    return (
      <div className="p-8 min-h-screen bg-[var(--bg-secondary)]">
        <h1 className="text-3xl font-bold mb-6">Active Surveys</h1>
        {surveys.length === 0 ? (
          <p>No active surveys available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
              <div
                key={survey._id}
                className="bg-white p-6 rounded-xl shadow border flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold mb-2">{survey.title}</h2>
                  <p className="text-gray-500">{survey.description}</p>
                </div>
                <button
                  onClick={() => setSelectedSurvey(survey)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Start Survey
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[var(--bg-secondary)]">
      <button
        onClick={() => {
          setSelectedSurvey(null);
          setAnswers({});
        }}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
      >
        ← Back to Surveys
      </button>

      <div className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{selectedSurvey.title}</h1>
        <p className="text-gray-500 mb-6">{selectedSurvey.description}</p>

        {selectedSurvey.questions.map((q) => (
          <div key={q._id} className="mb-6">
            <label className="block font-semibold mb-2">{q.questionText}</label>

            {q.questionType === "text" && (
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={answers[q._id] || ""}
                onChange={(e) => handleAnswerChange(q, e.target.value, "text")}
              />
            )}
            {q.questionType === "email" && (
              <input
                type="email"
                className="w-full border p-2 rounded"
                value={answers[q._id] || ""}
                onChange={(e) => handleAnswerChange(q, e.target.value, "email")}
              />
            )}
            {q.questionType === "number" && (
              <input
                type="number"
                className="w-full border p-2 rounded"
                value={answers[q._id] || ""}
                onChange={(e) => handleAnswerChange(q, e.target.value, "number")}
              />
            )}
            {(q.questionType === "radio" ||
              q.questionType === "checkbox" ||
              q.questionType === "dropdown") &&
              q.options?.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-1">
                  <input
                    type={q.questionType === "checkbox" ? "checkbox" : "radio"}
                    name={q._id}
                    checked={
                      q.questionType === "checkbox"
                        ? (answers[q._id] || []).includes(opt)
                        : answers[q._id] === opt
                    }
                    onChange={() => handleAnswerChange(q, opt, q.questionType)}
                  />
                  <span>{opt}</span>
                </div>
              ))}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Respondent;