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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSurveys: 0,
    totalResponses: 0,
  });
  const [users, setUsers] = useState([]);

  const fetchDashboard = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/dashboard");
      setStats(res.data.stats);
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const toggleUserStatus = async (userId) => {
    try {
      await axiosInstance.put(`/api/admin/block/${userId}`);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
      setStats((prev) => ({
        ...prev,
        activeUsers:
          prev.activeUsers +
          (users.find((u) => u._id === userId)?.isBlocked ? 1 : -1),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update user status");
    }
  };

  const blockedUsers = stats.totalUsers - stats.activeUsers;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Users size={36} />} label="Total Users" value={stats.totalUsers} color="blue" />
        <StatCard icon={<CheckCircle size={36} />} label="Active Users" value={stats.activeUsers} color="green" />
        <StatCard icon={<BarChart3 size={36} />} label="Total Surveys" value={stats.totalSurveys} color="purple" />
        <StatCard icon={<UserX size={36} />} label="Blocked Users" value={blockedUsers} color="red" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">User Status</h2>
          <Doughnut
            data={{
              labels: ["Active", "Blocked"],
              datasets: [
                { data: [stats.activeUsers, blockedUsers], backgroundColor: ["#16a34a", "#dc2626"] },
              ],
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Platform Overview</h2>
          <Bar
            data={{
              labels: ["Surveys", "Responses"],
              datasets: [
                { label: "Count", data: [stats.totalSurveys, stats.totalResponses], backgroundColor: ["#7c3aed", "#2563eb"] },
              ],
            }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">
                    {user.isBlocked ? (
                      <span className="text-red-600 font-semibold">Blocked</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Active</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleUserStatus(user._id)}
                      className={`px-4 py-1 rounded text-white transition ${
                        user.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorMap = { blue: "text-blue-600", green: "text-green-600", purple: "text-purple-600", red: "text-red-600" };
  return (
    <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 hover:scale-105 transition">
      <div className={colorMap[color]}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;