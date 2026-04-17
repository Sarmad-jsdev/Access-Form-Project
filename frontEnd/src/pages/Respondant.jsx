import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../axiosConfig";

const Respondent = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const messageRef = useRef(null);

  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.focus();
    }
  }, [message]);

  // FETCH SURVEYS
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await axiosInstance.get("/respondent/active-surveys");
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

    const formattedAnswers = selectedSurvey.questions.map((q) => ({
      questionText: q.questionText,
      answer: answers[q._id] || (q.questionType === "checkbox" ? [] : ""),
    }));

    try {
      await axiosInstance.post(
        `/respondent/survey/${selectedSurvey._id}/submit`,
        { answers: formattedAnswers }
      );

      setMessage("Response submitted successfully!");
      setSelectedSurvey(null);
      setAnswers({});
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit response.");
    }
  };

  if (loading) return <p className="p-8">Loading surveys...</p>;

  // LIST VIEW
  if (!selectedSurvey) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Active Surveys</h1>

        {message && (
          <div
            ref={messageRef}
            tabIndex="-1"
            className="mb-4 p-3 bg-green-100 rounded"
          >
            {message}
          </div>
        )}

        <div className="grid gap-4">
          {surveys.map((survey) => (
            <div key={survey._id} className="p-4 border rounded">
              <h2 className="font-bold">{survey.title}</h2>
              <p>{survey.description}</p>

              <button
                onClick={() => {
                  setSelectedSurvey(survey);
                  setMessage("");
                }}
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
              >
                Start Survey
              </button>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // FORM VIEW
  return (
    <main className="p-6">
      <button
        onClick={() => {
          setSelectedSurvey(null);
          setAnswers({});
        }}
        className="mb-4 bg-gray-200 px-3 py-1 rounded"
      >
        Back
      </button>

      <form onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold mb-2">{selectedSurvey.title}</h1>

        {selectedSurvey.questions.map((q) => (
          <div key={q._id} className="mb-4">
            <p className="font-semibold">{q.questionText}</p>

            {(q.questionType === "text" ||
              q.questionType === "email" ||
              q.questionType === "number") && (
              <input
                className="border p-2 w-full"
                value={answers[q._id] || ""}
                onChange={(e) =>
                  handleAnswerChange(q, e.target.value, q.questionType)
                }
              />
            )}

            {(q.questionType === "radio" ||
              q.questionType === "checkbox") &&
              q.options?.map((opt) => (
                <label key={opt} className="block">
                  <input
                    type={q.questionType}
                    checked={
                      q.questionType === "checkbox"
                        ? (answers[q._id] || []).includes(opt)
                        : answers[q._id] === opt
                    }
                    onChange={() =>
                      handleAnswerChange(q, opt, q.questionType)
                    }
                  />
                  {opt}
                </label>
              ))}

            {q.questionType === "dropdown" && (
              <select
                value={answers[q._id] || ""}
                onChange={(e) =>
                  handleAnswerChange(q, e.target.value, "dropdown")
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

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </main>
  );
};

export default Respondent;