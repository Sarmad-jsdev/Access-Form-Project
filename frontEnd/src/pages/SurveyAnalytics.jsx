import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";


const SurveyAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

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

  

  if (!analytics && !error) {
    return <div className="p-8">Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[var(--bg-secondary)]">
      <button
        onClick={() => navigate("/creator-dashboard")}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-xl shadow max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          {analytics.surveyTitle}
        </h1>

        <p className="mb-6 font-semibold">
          Total Responses: {analytics.totalResponses}
        </p>


        {/* Individual Responses */}
        {analytics.responses.length > 0 ? (
          analytics.responses.map((resp, idx) => (
            <div
              key={resp._id || idx}
              className="mb-4 p-4 border rounded"
            >
              <p className="font-medium mb-2">
                Response {idx + 1}
              </p>

              <p className="text-sm text-gray-600 mb-2">
                Respondent Name:{" "}
                {resp.respondentName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Respondent Email:{" "}
                {resp.respondentEmail}
              </p>

              {(resp.answers || []).map((ans, i) => (
                <div key={i} className="ml-2 mb-2">
                  <span className="font-semibold">
                    Question:
                  </span>{" "}
                  {ans.questionText || ans.question}
                  <br />
                  <span className="font-semibold">
                    Answer:
                  </span>{" "}
                  {Array.isArray(ans.answer)
                    ? ans.answer.join(", ")
                    : String(ans.answer ?? "")}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No responses yet.</p>
        )}
      </div>
    </div>
  );
};

export default SurveyAnalytics;