import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";

const SurveyAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const messageRef = useRef(null);

  // Focus message when error appears
  useEffect(() => {
    if (error && messageRef.current) {
      messageRef.current.focus();
    }
  }, [error]);

  // Fetch analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get(
          `${API_BASE_URL}/api/creator/survey-analytics/${id}`,
          { withCredentials: true }
        );
        setAnalytics(res.data);
      } catch (fetchError) {
        setError(
          fetchError.response?.data?.message ||
            "Failed to load analytics"
        );
      }
    };

    fetchAnalytics();
  }, [id, API_BASE_URL]);

  // Loading State
  if (!analytics && !error) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="p-8"
      >
        Loading analytics...
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        ref={messageRef}
        tabIndex="-1"
        role="alert"
        aria-live="assertive"
        className="p-8 text-red-700 bg-red-100 border border-red-300 rounded focus:outline-none"
      >
        {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-[var(--bg-secondary)]">
      {/* Back Button */}
      <button
        onClick={() => navigate("/creator-dashboard")}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition focus:ring-2 focus:ring-gray-400"
      >
        ← Back to Dashboard
      </button>

      <section
        aria-labelledby="analytics-heading"
        className="bg-[var(--bg-primary)] text-[var(--text-primary)] p-8 rounded-xl shadow max-w-5xl mx-auto"
      >
        <header className="mb-6">
          <h1
            id="analytics-heading"
            className="text-3xl font-bold"
          >
            {analytics.surveyTitle}
          </h1>

          <p className="mt-2 font-semibold text-lg">
            Total Responses:{" "}
            <span className="text-blue-600">
              {analytics.totalResponses}
            </span>
          </p>
        </header>

        {/* Responses Section */}
        <section aria-labelledby="responses-heading">
          <h2
            id="responses-heading"
            className="text-xl font-bold mb-4"
          >
            Individual Responses
          </h2>

          {analytics.responses.length > 0 ? (
            analytics.responses.map((resp, idx) => (
              <article
                key={resp._id || idx}
                className="mb-6 p-5 border rounded-lg shadow-sm bg-[var(--bg-secondary)] p-3 rounded text-[var(--text-primary)]"
              >
                <header className="mb-3 ">
                  <h3 className="font-semibold text-lg">
                    Response {idx + 1}
                  </h3>

                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong>{" "}
                    {resp.respondentName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong>{" "}
                    {resp.respondentEmail}
                  </p>
                </header>

                <section>
                  {(resp.answers || []).map((ans, i) => (
                    <div key={i} className="mb-3">
                      <p>
                        <strong>Question:</strong>{" "}
                        {ans.questionText || ans.question}
                      </p>
                      <p>
                        <strong>Answer:</strong>{" "}
                        {Array.isArray(ans.answer)
                          ? ans.answer.join(", ")
                          : String(ans.answer ?? "")}
                      </p>
                    </div>
                  ))}
                </section>
              </article>
            ))
          ) : (
            <p className="text-gray-600">
              No responses yet.
            </p>
          )}
        </section>
      </section>
    </main>
  );
};

export default SurveyAnalytics;