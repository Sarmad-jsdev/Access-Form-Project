import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { Link } from "react-router-dom";
import {
  Eye,
  BarChart,
  PlusCircle,
  Pencil,
  Trash2,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";

const CreatorDashboard = () => {
  // =========================
  // STATE MANAGEMENT
  // =========================
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
  });

  // =========================
  // FETCH ALL SURVEYS
  // =========================
  const fetchSurveys = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/creator/my-surveys");

      setSurveys(res.data.surveys || []);
      setStats(res.data.stats || stats);
    } catch (err) {
      toast.error("Failed to load surveys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  // =========================
  // COPY SURVEY LINK
  // =========================
  const handleCopyLink = (id) => {
    const link = `${window.location.origin}/survey/${id}`;
    navigator.clipboard.writeText(link);

    toast.success("Link copied 📋", {
      position: "top-center",
    });
  };

  // =========================
  // DELETE SURVEY
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this survey?")) return;

    try {
      await axiosInstance.delete(`/creator/delete-survey/${id}`);

      toast.success("Survey deleted");
      fetchSurveys();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // =========================
  // TOGGLE ACTIVE / INACTIVE
  // =========================
  const toggleStatus = async (id) => {
    try {
      await axiosInstance.patch(`/creator/toggle-survey/${id}`);

      toast.success("Status updated");
      fetchSurveys();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-8 font-[var(--font-dyslexia)]">

      {/* =========================
          HEADER SECTION
      ========================= */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Creator Dashboard
        </h1>

        {/* CREATE BUTTON */}
        <Link
          to="/CreateForm"
          className="flex items-center gap-2 bg-[var(--primary)] text-[var(--text-on-primary)] px-5 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          <PlusCircle size={18} />
          Create Survey
        </Link>
      </header>

      {/* =========================
          STATS SECTION
      ========================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <StatCard label="Total Surveys" value={stats.totalSurveys} />
        <StatCard label="Active Surveys" value={stats.activeSurveys} />
        <StatCard label="Responses" value={stats.totalResponses} />

      </section>

      {/* =========================
          LOADING STATE
      ========================= */}
      {loading && (
        <p className="text-[var(--text-secondary)]">
          Loading surveys...
        </p>
      )}

      {/* =========================
          EMPTY STATE
      ========================= */}
      {!loading && surveys.length === 0 && (
        <div className="text-center py-20 text-[var(--text-secondary)]">
          <p>No surveys created yet</p>

          <Link
            to="/CreateForm"
            className="text-[var(--primary)] font-semibold mt-3 inline-block"
          >
            Create your first survey →
          </Link>
        </div>
      )}

      {/* =========================
          SURVEY CARDS
      ========================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {surveys.map((survey) => (
          <div
            key={survey._id}
            className="bg-[var(--bg-primary)] p-6 rounded-2xl shadow border border-[var(--border)] hover:shadow-lg transition"
          >

            {/* TITLE */}
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {survey.title}
            </h2>

            <p className="text-[var(--text-secondary)] mt-2">
              {survey.description}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2 mt-5">

              {/* PREVIEW */}
              <Link
                to={`/preview/${survey._id}`}
                className="bg-[var(--btn-preview)] text-[var(--text-on-primary)] px-3 py-1.5 rounded text-sm flex items-center gap-1"
              >
                <Eye size={14} /> Preview
              </Link>


              {/* ⚠ FIXED ANALYTICS ROUTE */}
              <Link
                to={`/creator/analytics/${survey._id}`}
                className="bg-[var(--btn-analytics)] text-[var(--text-on-primary)] px-3 py-1.5 rounded text-sm flex items-center gap-1"
              >
                <BarChart size={14} /> Analytics
              </Link>

              {/* DELETE */}
              <button
                onClick={() => handleDelete(survey._id)}
                className="bg-[var(--btn-warning)] text-[var(--text-on-primary)] px-3 py-1.5 rounded text-sm flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={14} /> Delete
              </button>

              {/* COPY LINK */}
              <button
                onClick={() => handleCopyLink(survey._id)}
                className="bg-[var(--btn-success)] text-[var(--text-on-primary)] px-3 py-1.5 rounded text-sm flex items-center gap-1 cursor-pointer"
              >
                <Copy size={14} /> Copy
              </button>


            </div>

            {/* STATUS BADGE */}
            <div className="mt-4">
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  survey.isActive
                    ? "bg-[var(--status-active-bg)] text-[var(--status-active-text)]"
                    : "bg-[var(--status-inactive-bg)] text-[var(--status-inactive-text)]"
                }`}
              >
                {survey.isActive ? "Active" : "Inactive"}
              </span>
            </div>

          </div>
        ))}
      </section>
    </div>
  );
};

/* =========================
   STATS COMPONENT
========================= */
const StatCard = ({ label, value }) => (
  <div className="bg-[var(--bg-primary)] p-6 rounded-2xl shadow border border-[var(--border)]">
    <p className="text-[var(--text-secondary)]">{label}</p>
    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
      {value}
    </h2>
  </div>
);

export default CreatorDashboard;