import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig"; // Use configured axios
import { Users, BarChart, CheckCircle, UserX } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSurveys: 0,
    totalResponses: 0,
  });
  const [users, setUsers] = useState([]);

  // Fetch dashboard data from backend
  const fetchDashboard = async () => {
    try {
      // axiosInstance already has withCredentials: true
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

  // Toggle user status
  const toggleUserStatus = async (userId) => {
    try {
      // cookies are sent automatically
      await axiosInstance.put(
        `/api/admin/block/${userId}`,
        {}
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

      {/* Stats Cards */}
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
            <p className="text-sm text-gray-500">Blocked Users</p>
            <p className="text-2xl font-bold">{stats.totalUsers - stats.activeUsers}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <table className="w-full text-left">
          <thead className="border-b">
            <tr>
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </td>
                <td className="py-2">
                  {user.isBlocked ? (
                    <span className="text-red-600 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
                <td className="py-2">
                  <button
                    onClick={() => toggleUserStatus(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
  );
};

export default AdminDashboard;
