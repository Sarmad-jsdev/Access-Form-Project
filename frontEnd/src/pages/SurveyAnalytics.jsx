import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const SurveyAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/creator/survey-analytics/${id}`, {
          withCredentials: true,
        });
        setAnalytics(res.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, [id]);

  if (!analytics) {
    return (
      <div className="p-8">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[var(--bg-secondary)]">
      
      {/* Back button */}
      <button
        onClick={() => navigate("/creator-dashboard")}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-xl shadow max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{analytics.surveyTitle}</h1>
        <p className="mb-4 font-semibold">Total Responses: {analytics.totalResponses}</p>

        {analytics.responses.length > 0 ? (
          analytics.responses.map((resp, idx) => (
            <div key={idx} className="mb-4 p-4 border rounded">
              <p className="font-medium mb-2">Response {idx + 1}:</p>
              {resp.answers?.map((ans, i) => (
                <div key={i} className="ml-4">
                  <p>
                    <span className="font-semibold">Question ID:</span> {ans.questionId} <br/>
                    <span className="font-semibold">Answer:</span> {Array.isArray(ans.answer) ? ans.answer.join(", ") : ans.answer}
                  </p>
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