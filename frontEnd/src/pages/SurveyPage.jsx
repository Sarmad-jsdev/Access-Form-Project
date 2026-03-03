import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { AuthContext } from "../context/AuthContext";

const SurveyPage = () => {
  const { id } = useParams();
  const { user, loading } = useContext(AuthContext);

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const messageRef = useRef(null);

  const shareLink = window.location.href;

  // Focus message when it changes
  useEffect(() => {
    if ((message || error) && messageRef.current) {
      messageRef.current.focus();
    }
  }, [message, error]);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/respondent/survey/${id}/fill`
        );
        setSurvey(res.data);

        if (user) {
          const responsesRes = await axiosInstance.get(
            `/api/respondent/my-responses/${id}`
          );
          setAlreadySubmitted(
            Boolean(responsesRes.data?.submitted)
          );
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load survey"
        );
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

  if (loading || !user)
    return (
      <div role="status" aria-live="polite" className="text-center mt-8">
        Loading survey...
      </div>
    );

  if (!survey)
    return (
      <div className="text-center mt-8 text-red-600">
        Survey not found.
      </div>
    );

  if (survey.creator === user?.id && user.role === "creator") {
    return (
      <p className="text-center mt-8">
        Creators cannot fill their own survey.
      </p>
    );
  }

  if (alreadySubmitted) {
    return (
      <p className="text-center mt-8">
        You have already submitted this survey.
      </p>
    );
  }

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const formattedAnswers = normalizedQuestions.map((q) => ({
      question: q.questionText,
      answer:
        answers[q._id] ||
        (q.resolvedType === "checkbox" ? [] : ""),
    }));

    try {
      await axiosInstance.post(
        `/api/respondent/survey/${id}/submit`,
        { answers: formattedAnswers }
      );

      setMessage("Survey submitted successfully!");
      setAlreadySubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit response"
      );
    }
  };

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setMessage("Survey link copied to clipboard!");
    } catch {
      setError("Failed to copy link.");
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">
          {survey.title}
        </h1>
        <p>{survey.description}</p>
      </header>

      {(message || error) && (
        <div
          ref={messageRef}
          tabIndex="-1"
          role={error ? "alert" : "status"}
          aria-live={error ? "assertive" : "polite"}
          className={`mb-4 p-3 rounded border focus:outline-none ${
            error
              ? "bg-red-100 border-red-300 text-red-700"
              : "bg-green-100 border-green-300 text-green-700"
          }`}
        >
          {error || message}
        </div>
      )}

      <button
        onClick={copyLinkToClipboard}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded focus:ring-2 focus:ring-blue-400"
      >
        Copy Share Link
      </button>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {normalizedQuestions.map((q) => (
          <fieldset key={q._id}>
            <legend className="font-semibold mb-2">
              {q.questionText}
            </legend>

            {(q.resolvedType === "text" ||
              q.resolvedType === "email" ||
              q.resolvedType === "number") && (
              <input
                type={q.resolvedType}
                value={answers[q._id] || ""}
                onChange={(e) =>
                  handleChange(q._id, e.target.value)
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                required
              />
            )}

            {q.resolvedType === "textarea" && (
              <textarea
                value={answers[q._id] || ""}
                onChange={(e) =>
                  handleChange(q._id, e.target.value)
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                required
              />
            )}

            {q.resolvedType === "radio" &&
              q.options?.map((opt, idx) => (
                <div key={idx}>
                  <input
                    id={`${q._id}-${idx}`}
                    type="radio"
                    name={q._id}
                    value={opt}
                    checked={answers[q._id] === opt}
                    onChange={(e) =>
                      handleChange(q._id, e.target.value)
                    }
                    required
                  />
                  <label
                    htmlFor={`${q._id}-${idx}`}
                    className="ml-2"
                  >
                    {opt}
                  </label>
                </div>
              ))}

            {q.resolvedType === "checkbox" &&
              q.options?.map((opt, idx) => (
                <div key={idx}>
                  <input
                    id={`${q._id}-${idx}`}
                    type="checkbox"
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
                  <label
                    htmlFor={`${q._id}-${idx}`}
                    className="ml-2"
                  >
                    {opt}
                  </label>
                </div>
              ))}

            {q.resolvedType === "dropdown" && (
              <select
                value={answers[q._id] || ""}
                onChange={(e) =>
                  handleChange(q._id, e.target.value)
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                required
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
          className="px-4 py-2 bg-green-600 text-white rounded focus:ring-2 focus:ring-green-400"
        >
          Submit Response
        </button>
      </form>
    </main>
  );
};

export default SurveyPage;