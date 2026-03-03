import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";

const SurveyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [shareLink, setShareLink] = useState(window.location.href);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in → redirect to login with redirect param
        navigate(`/login?redirect=/survey/${id}`, { replace: true });
        return;
      }
    }
  }, [user, loading, navigate, id]);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axiosInstance.get(`/api/creator/survey/${id}`);
        setSurvey(res.data);

        // Check if current user already submitted
        if (user) {
          const responsesRes = await axiosInstance.get(`/api/respondent/my-responses/${id}`);
          setAlreadySubmitted(responsesRes.data.submitted); // expects { submitted: true/false }
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load survey");
      }
    };

    if (user) fetchSurvey();
  }, [user, id]);

  if (!survey) return <p className="text-center mt-8">Loading survey...</p>;

  // Prevent creator from filling their own survey
  if (survey.creator === user?.id && user.role === "creator") {
    return <p className="text-center mt-8">Creators cannot fill their own survey.</p>;
  }

  if (alreadySubmitted) {
    return <p className="text-center mt-8">You have already submitted this survey.</p>;
  }

  const handleChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post(`/api/respondent/submit-response/${id}`, { answers });
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
        {survey.questions.map((q) => (
          <div key={q._id}>
            <label className="font-semibold block mb-1">{q.questionText}</label>
            {q.type === "text" && (
              <input
                type="text"
                value={answers[q._id] || ""}
                onChange={(e) => handleChange(q._id, e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            )}
            {q.type === "textarea" && (
              <textarea
                value={answers[q._id] || ""}
                onChange={(e) => handleChange(q._id, e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            )}
            {q.type === "radio" &&
              q.options.map((opt, idx) => (
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
            {q.type === "checkbox" &&
              q.options.map((opt, idx) => (
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
                          handleChange(q._id, prev.filter((x) => x !== opt));
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