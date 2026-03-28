import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { Link } from "react-router-dom";
import { Eye, BarChart, PlusCircle, Pencil, Trash2, Copy } from "lucide-react";

const CreatorDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Copy link to clipboard
  const handleCopyLink = (surveyId) => {
    const link = `${window.location.origin}/survey/${surveyId}`;
    navigator.clipboard.writeText(link);
    alert("Survey link copied to clipboard!");
  };

  const fetchSurveys = async () => {
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/api/creator/my-surveys`, {
        withCredentials: true,
      });
      setSurveys(res.data.surveys);
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this survey?")) return;
    try {
      await axiosInstance.delete(`${API_BASE_URL}/api/creator/delete-survey/${id}`, {
        withCredentials: true,
      });
      fetchSurveys();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Form Dashboard</h1>

        <Link
          to="/CreateForm"
          className="flex items-center gap-2 bg-[var(--primary)] text-[var(--text-on-primary)] px-6 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          aria-label="Create a new form"
        >
          <PlusCircle size={20} />
          Create New Form
        </Link>
      </header>

      {/* Stats */}
      <section aria-labelledby="dashboard-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <h2 id="dashboard-stats" className="sr-only">Dashboard Statistics</h2>

        <StatCard label="Total Forms" value={stats.totalSurveys} />
        <StatCard label="Active Forms" value={stats.activeSurveys} />
        <StatCard label="Total Responses" value={stats.totalResponses} />
      </section>

      {/* Form Cards */}
      <section aria-labelledby="form-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <h2 id="form-cards" className="sr-only">My Surveys</h2>

        {surveys.map((survey) => (
          <article key={survey._id} className="bg-[var(--bg-primary)] p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{survey.title}</h3>
            <p className="text-[var(--text-secondary)] mt-2">{survey.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={`/preview/${survey._id}`}
                className="bg-blue-600 text-[var(--text-on-primary)] px-4 py-2 rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                aria-label={`Preview survey ${survey.title}`}
              >
                <Eye size={16} /> Preview
              </Link>

              <Link
                to={`/edit/${survey._id}`}
                className="bg-yellow-500 text-[var(--text-on-primary)] px-4 py-2 rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                aria-label={`Edit survey ${survey.title}`}
              >
                <Pencil size={16} /> Edit
              </Link>

              <Link
                to={`/analytics/${survey._id}`}
                className="bg-purple-600 text-[var(--text-on-primary)] px-4 py-2 rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                aria-label={`View analytics for survey ${survey.title}`}
              >
                <BarChart size={16} /> Analytics
              </Link>

              <button
                onClick={() => handleDelete(survey._id)}
                className="bg-red-600 text-[var(--text-on-primary)] px-4 py-2 rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                aria-label={`Delete survey ${survey.title}`}
              >
                <Trash2 size={16} /> Delete
              </button>

              <button
                onClick={() => handleCopyLink(survey._id)}
                className="bg-green-600 text-[var(--text-on-primary)] px-4 py-2 rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                aria-label={`Copy link for survey ${survey.title}`}
              >
                <Copy size={16} /> Copy Link
              </button>
            </div>

            <div className="mt-4">
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  survey.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
                aria-label={survey.isActive ? "Active Survey" : "Inactive Survey"}
              >
                {survey.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ label, value }) => (
  <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow">
    <p className="text-[var(--text-secondary)]">{label}</p>
    <h2 className="text-2xl font-bold text-[var(--text-primary)]">{value}</h2>
  </div>
);

export default CreatorDashboard;