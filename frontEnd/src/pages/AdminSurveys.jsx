import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import DashboardLayout from "../Components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


const AdminSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/admin/surveys").then((res) => {
      setSurveys(res.data || []);
    });
  }, []);

  return (
    <DashboardLayout title="Surveys">

        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/AdminDashboard")}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] flex items-center text-[var(--text-on-primary)] cursor-pointer text-sm"
          >
             <ArrowLeft size={15} /> Back to Dashboard
          </button>
        </div>

      <div className="grid gap-4 max-w-3xl">

        {surveys.map((s) => (
          <div
            key={s._id}
            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5 flex justify-between items-center"
          >

            <div>
              <h2 className="font-semibold text-[var(--text-primary)]">
                {s.title}
              </h2>

              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {s.description}
              </p>

              <p className="text-xs mt-2 text-[var(--text-secondary)]">
                Created by: {s.createdBy?.name || "Unknown"}
              </p>
            </div>

            <button
              onClick={() => navigate(`/admin/surveys/preview/${s._id}`)}
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--text-on-primary)] cursor-pointer text-sm"
            >
              Preview
            </button>

          </div>
        ))}

      </div>

    </DashboardLayout>
  );
};

export default AdminSurveys;