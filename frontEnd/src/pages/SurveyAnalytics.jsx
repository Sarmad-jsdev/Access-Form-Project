import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SurveyAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const messageRef = useRef(null);

  // =========================
  // FETCH ANALYTICS
  // =========================
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(
          `/creator/analytics/${id}`
        );

        setAnalytics(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  // =========================
  // EXPORT CSV
  // =========================
  const exportCSV = () => {
    if (!analytics?.responses) return;

    let csv = "Response,Name,Email,Question,Answer\n";

    analytics.responses.forEach((resp, index) => {
      resp.answers.forEach((ans) => {
        csv += `${index + 1},${resp.respondentName},${resp.respondentEmail},${ans.questionText},${
          Array.isArray(ans.answer)
            ? ans.answer.join("|")
            : ans.answer
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

  // =========================
  // EXPORT PDF
  // =========================
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
          Array.isArray(ans.answer)
            ? ans.answer.join(", ")
            : ans.answer,
        ]);
      });
    });

    autoTable(doc, {
      startY: 35,
      head: [["#", "Name", "Email", "Question", "Answer"]],
      body: tableData,
    });

    doc.save(`${analytics.surveyTitle}-report.pdf`);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <div className="p-8 text-[var(--text-secondary)]">Loading...</div>;
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div ref={messageRef} className="p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-[var(--bg-secondary)]">

      {/* BACK */}
      <button
        onClick={() => navigate("/creator-dashboard")}
        className="mb-4 px-4 py-2 rounded bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)]"
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border)] mb-6">

        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          {analytics.surveyTitle}
        </h1>

        <p className="text-[var(--text-secondary)] mt-2">
          Total Responses:{" "}
          <span className="text-[var(--primary)] font-bold">
            {analytics.totalResponses}
          </span>
        </p>

        {/* EXPORT BUTTONS */}
        <div className="flex gap-3 mt-4">

          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--text-on-primary)] cursor-pointer transition"
          >
            Export CSV
          </button>

          <button
            onClick={exportPDF}
            className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--text-on-primary)] cursor-pointer transition"
          >
            Export PDF
          </button>

        </div>
      </div>

      {/* RESPONSES */}
      <div className="space-y-6">

        {analytics.responses.map((resp, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)]"
          >
            <h2 className="font-bold text-[var(--text-primary)]">
              Response #{i + 1}
            </h2>

            <p className="text-[var(--text-secondary)]">
              {resp.respondentName} ({resp.respondentEmail})
            </p>

            <div className="mt-3 space-y-2">
              {resp.answers.map((ans, j) => (
                <div key={j} className="p-3 bg-[var(--bg-secondary)] rounded">
                  <p className="font-semibold">{ans.questionText}</p>
                  <p className="text-[var(--text-secondary)]">
                    {Array.isArray(ans.answer)
                      ? ans.answer.join(", ")
                      : ans.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </main>
  );
};

export default SurveyAnalytics;