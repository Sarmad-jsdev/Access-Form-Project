import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";

const SurveyPage = () => {
  const { id } = useParams();
  const { user, loading } = useContext(AuthContext);

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [shareLink] = useState(window.location.href);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axiosInstance.get(`/api/creator/survey/${id}`);
        setSurvey(res.data);

        if (user) {
          const responsesRes = await axiosInstance.get(`/api/respondent/my-responses/${id}`);
          setAlreadySubmitted(Boolean(responsesRes.data?.submitted));
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load survey");
      }
    };

    if (!loading && user) fetchSurvey();
  }, [user, loading, id]);


  const normalizedQuestions = useMemo(
    () =>
      (survey?.questions || []).map((q) => ({
        ...q,
        resolvedType: q.questionType || q.type || "text",
      })),
    [survey]
  );

  if (loading || !user || !survey) return <p className="text-center mt-8">Loading survey...</p>;

  if (survey.creator === user?.id && user.role === "creator") {
    return <p className="text-center mt-8">Creators cannot fill their own survey.</p>;
  }

  if (alreadySubmitted) {
    return <p className="text-center mt-8">You have already submitted this survey.</p>;
  }

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedAnswers = normalizedQuestions.map((q) => ({
      questionText: q.questionText,
      answer: answers[q._id] || (q.resolvedType === "checkbox" ? [] : ""),
    }));

    try {
      await axiosInstance.post(`/api/respondent/submit-response/${id}`, {
        answers: formattedAnswers,
      });
      alert("Survey submitted successfully!");
      setAlreadySubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit response");
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Survey link copied!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{survey.title}</h1>
      <p className="mb-6">{survey.description}</p>

      <button
        onClick={copyLinkToClipboard}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Copy Share Link
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        {normalizedQuestions.map((q) => (
          <div key={q._id}>
            <label className="font-semibold block mb-1">{q.questionText}</label>

            {q.resolvedType === "text" && (
              <input
                type="text"
                value={answers[q._id] || ""}
                onChange={(e) => handleChange(q._id, e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            )}

            {q.resolvedType === "email" && (
              <input
                type="email"
                value={answers[q._id] || ""}
                onChange={(e) => handleChange(q._id, e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            )}

            {q.resolvedType === "number" && (
              <input
                type="number"
                value={answers[q._id] || ""}
                onChange={(e) => handleChange(q._id, e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            )}

            {q.resolvedType === "textarea" && (
              <textarea
                value={answers[q._id] || ""}
                onChange={(e) => handleChange(q._id, e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            )}
            

            {(q.resolvedType === "radio" || q.resolvedType === "dropdown") &&
              q.options?.map((opt, idx) => (
                <div key={idx}>
                  <label>
                    <input
                      type="radio"
                      name={q._id}
                      value={opt}
                      checked={answers[q._id] === opt}
                      onChange={(e) => handleChange(q._id, e.target.value)}
                      required
                    />
                    <span className="ml-2">{opt}</span>
                  </label>
                </div>
              ))}


            {q.resolvedType === "checkbox" &&
              q.options?.map((opt, idx) => (
                <div key={idx}>
                  <label>
                    <input
                      type="checkbox"
                      name={q._id}
                      value={opt}
                      checked={(answers[q._id] || []).includes(opt)}
                      onChange={(e) => {
                        const prev = answers[q._id] || [];
                        if (e.target.checked) {
                          handleChange(q._id, [...prev, opt]);
                        } else {
                
                          handleChange(
                            q._id,
                            prev.filter((x) => x !== opt)
                          );
                        }
                      }}
                    />
                    <span className="ml-2">{opt}</span>
                  </label>
                </div>
              ))}
          </div>
        ))}

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Submit Response
        </button>
      </form>
    </div>
  );
};

export default SurveyPage;