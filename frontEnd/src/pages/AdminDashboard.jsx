import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { Users, BarChart3, CheckCircle, UserX } from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers:0, activeUsers:0, totalSurveys:0, totalResponses:0 });
  const [users, setUsers] = useState([]);
  const [chartKey, setChartKey] = useState(0); // re-render charts on theme change

  useEffect(() => {
    fetchDashboard();
    const handler = () => setChartKey(k => k+1); // re-render charts
    window.addEventListener('themeChange', handler);
    return () => window.removeEventListener('themeChange', handler);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/dashboard");
      setStats(res.data.stats);
      setUsers(res.data.users);
    } catch (err) { console.error(err); alert("Failed to fetch dashboard data"); }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await axiosInstance.put(`/api/admin/block/${userId}`);
      setUsers(prev => prev.map(u => u._id === userId ? {...u, isBlocked: !u.isBlocked} : u));
      setStats(prev => ({...prev, activeUsers: prev.activeUsers + (users.find(u => u._id===userId)?.isBlocked ? 1 : -1)}));
    } catch (err) { console.error(err); alert("Failed to update user status"); }
  };

  const blockedUsers = stats.totalUsers - stats.activeUsers;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-secondary)] p-6 md:p-12 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10 ">
        <StatCard icon={<Users size={36}/>} label="Total Users" value={stats.totalUsers} color="blue" />
        <StatCard icon={<CheckCircle size={36}/>} label="Active Users" value={stats.activeUsers} color="green"/>
        <StatCard icon={<BarChart3 size={36}/>} label="Total Surveys" value={stats.totalSurveys} color="purple"/>
        <StatCard icon={<UserX size={36}/>} label="Blocked Users" value={blockedUsers} color="red"/>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-[var(--card-shadow)]">
          <h2 className="font-bold mb-4 text-[var(--text-primary)]">User Status</h2>
          <Doughnut key={chartKey} data={{
            labels:["Active","Blocked"],
            datasets:[{data:[stats.activeUsers, blockedUsers], backgroundColor:["var(--primary-dark)","#dc2626"]}],
          }}/>
        </div>

        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-[var(--card-shadow)]">
          <h2 className="font-bold mb-4 text-[var(--text-primary)]">Platform Overview</h2>
          <Bar key={chartKey} data={{
            labels:["Surveys","Responses"],
            datasets:[{label:"Count", data:[stats.totalSurveys, stats.totalResponses], backgroundColor:["var(--primary-dark)","var(--primary)"]}],
          }}/>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-[var(--card-shadow)]">
        <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
              <tr>
                {["Name","Email","Role","Status","Action"].map(h => <th key={h} className="p-3 text-[var(--text-primary)]">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b hover:bg-[var(--bg-primary)] transition">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    {u.isBlocked ? <span className="text-red-600 font-semibold">Blocked</span> : <span className="text-green-600 font-semibold">Active</span>}
                  </td>
                  <td className="p-3">
                    <button onClick={()=>toggleUserStatus(u._id)}
                      className={`px-4 py-1 rounded text-white transition ${u.isBlocked?"bg-green-500 hover:bg-green-600":"bg-red-500 hover:bg-red-600"}`}>
                      {u.isBlocked?"Unblock":"Block"}
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

const StatCard = ({ icon,label,value,color })=>{
  const colorMap = {blue:"text-blue-600",green:"text-green-600",purple:"text-purple-600",red:"text-red-600"};
  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-[var(--card-shadow)] flex items-center gap-4 hover:scale-105 transition">
      <div className={colorMap[color]}>{icon}</div>
      <div>
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
        <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;