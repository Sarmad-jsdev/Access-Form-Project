import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, BarChart, CheckCircle, UserX } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSurveys: 0,
    totalResponses: 0,
  });
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch dashboard data from backend
  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Toggle user status
  const toggleUserStatus = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/block/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboard(); // Refresh data after status change
    } catch (err) {
      console.error(err);
      alert("Failed to update user status");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6 md:p-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Admin Dashboard
        </h1>
      </header>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
          <Users className="text-blue-600" size={36} />
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
          <CheckCircle className="text-green-600" size={36} />
          <div>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-2xl font-bold">{stats.activeUsers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
          <BarChart className="text-purple-600" size={36} />
          <div>
            <p className="text-sm text-gray-500">Total Surveys</p>
            <p className="text-2xl font-bold">{stats.totalSurveys}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
          <UserX className="text-red-600" size={36} />
          <div>
            <p className="text-sm text-gray-500">Total Responses</p>
            <p className="text-2xl font-bold">{stats.totalResponses}</p>
          </div>
        </div>
      </div>

      {/* --- Users Table --- */}
      <div className="bg-white shadow rounded-xl border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{user.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => toggleUserStatus(user._id)}
                    className={`px-4 py-2 rounded-lg text-white font-bold ${
                      user.status === "active" ? "bg-red-600" : "bg-green-600"
                    }`}
                  >
                    {user.status === "active" ? "Block" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;