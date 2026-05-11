import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { Users, BarChart3, CheckCircle, UserX } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import DashboardLayout from "../Components/DashboardLayout";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

/* ─── stat card ───────────────────────────────────────────── */
const StatCard = ({ icon, label, value }) => {
  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{
          background: "var(--bg-secondary)",
          color: "var(--primary)",
        }}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs text-[var(--text-secondary)] font-medium">
          {label}
        </p>
        <p className="text-2xl font-bold text-[var(--text-primary)]">
          {value}
        </p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSurveys: 0,
    totalResponses: 0,
  });

  const [users, setUsers] = useState([]);
  const [chartKey, setChartKey] = useState(0);

  // theme reactive values
  const getThemeValues = () => {
    const root = document.documentElement;
    return {
      text: getComputedStyle(root).getPropertyValue("--text-primary"),
      border: getComputedStyle(root).getPropertyValue("--border"),
      primary: getComputedStyle(root).getPropertyValue("--primary"),
      accent: getComputedStyle(root).getPropertyValue("--accent"),
      danger: getComputedStyle(root).getPropertyValue("--status-inactive-text"),
    };
  };

  const [themeVals, setThemeVals] = useState(getThemeValues());

  useEffect(() => {
    fetchDashboard();

    const handler = () => {
      setChartKey((k) => k + 1);
      setThemeVals(getThemeValues());
    };

    window.addEventListener("themeChange", handler);
    return () => window.removeEventListener("themeChange", handler);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axiosInstance.get("/admin/dashboard");
      setStats(res.data.stats);
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard data");
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await axiosInstance.put(`/admin/block/${userId}`);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );

      setStats((prev) => {
        const target = users.find((u) => u._id === userId);
        const wasBlocked = target?.isBlocked;

        return {
          ...prev,
          activeUsers: prev.activeUsers + (wasBlocked ? 1 : -1),
        };
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update user status");
    }
  };

  const blockedUsers = stats.totalUsers - stats.activeUsers;

  return (
    <DashboardLayout title="Admin Dashboard">

      {/* ─── STATS ───────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard  aria-label="Total Users" icon={<Users size={20} />} label="Total Users" value={stats.totalUsers} />
        <StatCard aria-label="Active Users" icon={<CheckCircle size={20} />} label="Active Users" value={stats.activeUsers} />
        <StatCard aria-label="Total Surveys" icon={<BarChart3 size={20} />} label="Total Surveys" value={stats.totalSurveys} />
        <StatCard aria-label="Blocked Users" icon={<UserX size={20} />} label="Blocked Users" value={blockedUsers} />
      </div>

      {/* ─── CHARTS ───────────────── */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">

        {/* Doughnut */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5">
          <h2 className="font-semibold text-sm text-[var(--text-primary)] mb-4">
            User Status
          </h2>

          <Doughnut
            key={chartKey}
            aria-label="User status Distribution chart"
            data={{
              labels: ["Active", "Blocked"],
              datasets: [
                {
                  data: [stats.activeUsers, blockedUsers],
                  backgroundColor: [
                    themeVals.primary,
                    themeVals.danger,
                  ],
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: themeVals.text,
                  },
                },
              },
            }}
          />
        </div>

        {/* Bar */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5">
          <h2 className="font-semibold text-sm text-[var(--text-primary)] mb-4">
            Platform Overview
          </h2>

          <Bar
            key={chartKey}
            aria-label="Survey & Responses"
            data={{
              labels: ["Surveys", "Responses"],
              datasets: [
                {
                  label: "Count",
                  data: [stats.totalSurveys, stats.totalResponses],
                  backgroundColor: [
                    themeVals.primary,
                    themeVals.accent,
                  ],
                  borderRadius: 6,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: themeVals.text,
                  },
                },
              },
              scales: {
                x: {
                  ticks: { color: themeVals.text },
                  grid: { color: themeVals.border },
                },
                y: {
                  beginAtZero: true,
                  ticks: { color: themeVals.text },
                  grid: { color: themeVals.border },
                },
              },
            }}
          />
        </div>
      </div>

      
    </DashboardLayout>
  );
};

export default AdminDashboard;