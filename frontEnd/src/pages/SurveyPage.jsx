import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";

const SurveyPage = () => {
  const { id } = useParams();
  const { user, loading } = useContext(AuthContext);

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axiosInstance.get(
          `/respondent/survey/${id}/fill`
        );

        setSurvey(res.data);
      } catch (err) {
        setError("Failed to load survey");
      }
    };

    if (!loading && user) fetchSurvey();
  }, [user, loading, id]);

  const questions = useMemo(
    () => survey?.questions || [],
    [survey]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatted = questions.map((q) => ({
      questionText: q.questionText,
      answer: answers[q._id] || "",
    }));

    try {
      await axiosInstance.post(
        `/respondent/survey/${id}/submit`,
        { answers: formatted }
      );

      setMessage("Submitted successfully!");
    } catch (err) {
      setError("Submit failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!survey) return <p>Survey not found</p>;

  return (
    <div>
      <h1>{survey.title}</h1>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q._id}>
            <p>{q.questionText}</p>

            <input
              value={answers[q._id] || ""}
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [q._id]: e.target.value,
                })
              }
            />
          </div>
        ))}

        <button>Submit</button>
      </form>
    </div>
  );
};

export default SurveyPage;