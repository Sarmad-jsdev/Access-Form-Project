import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import DashboardLayout from "../Components/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SurveyPreview = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/admin/surveys/${id}`)
      .then((res) => setSurvey(res.data));
  }, [id]);

  if (!survey) return <p>Loading...</p>;

  return (
    <DashboardLayout title="Survey Preview">

      <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/AdminDashboard")}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] flex items-center text-[var(--text-on-primary)] cursor-pointer text-sm"
          >
             <ArrowLeft size={15} /> Back to Dashboard
          </button>
        </div>

      <h2 className="text-xl font-bold">{survey.title}</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        {survey.description}
      </p>

      <div className="space-y-3">
        {survey.questions.map((q, i) => (
          <div
            key={i}
            className="p-4 border border-[var(--border)] rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)]"
          >
            <p className="font-medium">
              {i + 1}. {q.questionText}
            </p>

            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Type: {q.questionType}
            </p>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
};

export default SurveyPreview;