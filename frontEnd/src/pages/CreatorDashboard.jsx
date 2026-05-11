import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { Link } from "react-router-dom";
import {
  Eye,
  BarChart,
  PlusCircle,
  Trash2,
  Copy,
  FileText,
  Activity,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../Components/DashboardLayout";

/* ─── small stat card ─────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, accent }) => (
  <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-4">
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: accent + "18" }}
    >
      <Icon size={20} style={{ color: accent }} />
    </div>
    <div>
      <p className="text-xs text-[var(--text-secondary)] font-medium">{label}</p>
      <p className="text-2xl font-bold text-[var(--text-primary)] leading-tight">{value}</p>
    </div>
  </div>
);

const CreatorDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSurveys: 0, activeSurveys: 0, totalResponses: 0 });

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/creator/my-surveys");
      setSurveys(res.data.surveys || []);
      setStats(res.data.stats || stats);
    } catch {
      toast.error("Failed to load surveys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSurveys(); }, []);

  const handleCopyLink = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/survey/${id}`);
    toast.success("Link copied 📋", { position: "top-center" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this survey?")) return;
    try {
      await axiosInstance.delete(`/creator/delete-survey/${id}`);
      toast.success("Survey deleted");
      fetchSurveys();
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axiosInstance.patch(`/creator/toggle-survey/${id}`);
      toast.success("Status updated");
      fetchSurveys();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <DashboardLayout title="Creator Dashboard">

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Surveys" value={stats.totalSurveys} icon={FileText} accent="#3b82f6" />
        <StatCard label="Active Surveys" value={stats.activeSurveys} icon={Activity} accent="#22c55e" />
        <StatCard label="Total Responses" value={stats.totalResponses} icon={TrendingUp} accent="#f59e0b" />
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Your Surveys</h2>
        <Link
          to="/CreateForm"
          aria-label="Create new survey"
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg text-[var(--text-on-primary)] cursor-pointer transition"
          style={{ background: "var(--primary)" }}
        >
          <PlusCircle size={15} aria-hidden="true" /> New Survey
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-[var(--text-secondary)] text-sm">Loading surveys…</p>
      )}

      {/* Empty state */}
      {!loading && surveys.length === 0 && (
        <div className="text-center py-20 text-[var(--text-secondary)]">
          <FileText size={36} className="mx-auto mb-3 opacity-30" />
          <p className="mb-3">No surveys yet</p>
          <Link to="/CreateForm" className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
            Create your first survey →
          </Link>
        </div>
      )}

      {/* Survey cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {surveys.map((survey) => (
          <div
            key={survey._id}
            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition"
          >
            {/* Card header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--text-primary)] truncate">{survey.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{survey.description}</p>
              </div>
              {/* Status badge */}
              <span
                aria-label={survey.isActive ? "Survey is active" : "Survey is inactive"}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  survey.isActive
                    ? "bg-[var(--status-active-bg)] text-[var(--status-active-text)]"
                    : "bg-[var(--status-inactive-bg)] text-[var(--status-inactive-text)]"
                }`}
              >
                {survey.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Toggle active button */}
            <button
              onClick={() => toggleStatus(survey._id)}
              aria-label={survey.isActive ? "Deactivate survey" : "Activate survey"}
              className="text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] p-2 rounded-sm underline underline-offset-2 text-left w-fit cursor-pointer hover:bg-[var(--primary)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            >
              {survey.isActive ? "Deactivate" : "Activate"}
            </button>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-[var(--border)]">
              <Link
                to={`/preview/${survey._id}`}
                aria-label="Preview survey"
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer hover:bg-[var(--primary)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                style={{ background: "var(--btn-preview, #3b82f6)", color: "#fff" }}
              >
                <Eye size={12} aria-hidden="true" /> Preview
              </Link>
              <Link
                to={`/creator/analytics/${survey._id}`}
                aria-label="View survey analytics"
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer hover:bg-[var(--primary)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                style={{ background: "var(--btn-analytics, #8b5cf6)", color: "#fff" }}
              >
                <BarChart size={12} aria-hidden="true" /> Analytics
              </Link>
              <button
                onClick={() => handleCopyLink(survey._id)}
                  aria-label="Copy survey link"
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer"
                style={{ background: "var(--btn-success, #22c55e)", color: "#fff" }}
              >
                <Copy size={12} aria-hidden="true" /> Copy Link
              </button>
              <button
                onClick={() => handleDelete(survey._id)}
                aria-label="Delete survey"
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer"
                style={{ background: "var(--btn-warning, #ef4444)", color: "#fff" }}
              >
                <Trash2 size={12} aria-hidden="true" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default CreatorDashboard;