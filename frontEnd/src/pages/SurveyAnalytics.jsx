import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardLayout from "../Components/DashboardLayout";

const SurveyAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const messageRef = useRef(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/creator/analytics/${id}`);
        setAnalytics(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  const exportCSV = () => {
    if (!analytics?.responses) return;
    let csv = "Response,Name,Email,Question,Answer\n";
    analytics.responses.forEach((resp, index) => {
      resp.answers.forEach((ans) => {
        csv += `${index + 1},${resp.respondentName},${resp.respondentEmail},${ans.questionText},${
          Array.isArray(ans.answer) ? ans.answer.join("|") : ans.answer
        }\n`;
      });
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${analytics.surveyTitle}-report.csv`;
    a.click();
  };

  const exportPDF = () => {
    if (!analytics?.responses) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(analytics.surveyTitle, 14, 15);
    doc.setFontSize(11);
    doc.text(`Total Responses: ${analytics.totalResponses}`, 14, 25);
    const tableData = [];
    analytics.responses.forEach((resp, index) => {
      resp.answers.forEach((ans) => {
        tableData.push([
          index + 1,
          resp.respondentName,
          resp.respondentEmail,
          ans.questionText,
          Array.isArray(ans.answer) ? ans.answer.join(", ") : ans.answer,
        ]);
      });
    });
    autoTable(doc, { startY: 35, head: [["#", "Name", "Email", "Question", "Answer"]], body: tableData });
    doc.save(`${analytics.surveyTitle}-report.pdf`);
  };

  if (loading) {
    return (
      <DashboardLayout title="Analytics">
        <p className="text-[var(--text-secondary)] text-sm">Loading…</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Analytics">
        <p ref={messageRef} className="text-red-500 text-sm">{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={analytics.surveyTitle}>
      <div className="max-w-3xl space-y-6">

        {/* Back */}
        <button
          onClick={() => navigate("/CreatorDashboard")}
          className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </button>

        {/* Header card */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-semibold text-[var(--text-primary)]">{analytics.surveyTitle}</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                Total responses:{" "}
                <span className="font-bold" style={{ color: "var(--primary)" }}>
                  {analytics.totalResponses}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg font-medium text-white transition"
                style={{ background: "var(--primary)" }}
              >
                <Download size={14} /> CSV
              </button>
              <button
                onClick={exportPDF}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg font-medium text-white transition"
                style={{ background: "var(--accent, #8b5cf6)" }}
              >
                <Download size={14} /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* Responses */}
        <div className="space-y-4">
          {analytics.responses.map((resp, i) => (
            <div
              key={i}
              className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "var(--primary)" }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--text-primary)]">{resp.respondentName}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{resp.respondentEmail}</p>
                </div>
              </div>

              <div className="space-y-2">
                {resp.answers.map((ans, j) => (
                  <div key={j} className="bg-[var(--bg-secondary)] rounded-xl p-3">
                    <p className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">{ans.questionText}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {Array.isArray(ans.answer) ? ans.answer.join(", ") : ans.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SurveyAnalytics;