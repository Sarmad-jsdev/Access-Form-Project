import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Eye, BarChart, PlusCircle, Pencil, Trash2 } from "lucide-react";

const CreatorDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchSurveys = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/creator/my-surveys`,
        { withCredentials: true }
      );

      setSurveys(res.data.surveys);
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

// Handle Delete Survey
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure?")) return;

  await axios.delete(
    `${API_BASE_URL}/api/creator/delete-survey/${id}`,
    { withCredentials: true }
  );

  fetchSurveys();
};

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          My Form Dashboard
        </h1>

        <Link
          to="/CreateForm"
          className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-2 rounded-lg font-semibold"
        >
          <PlusCircle size={20} />
          Create New Form
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Forms</p>
          <h2 className="text-2xl font-bold">{stats.totalSurveys}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Active Forms</p>
          <h2 className="text-2xl font-bold">{stats.activeSurveys}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Responses</p>
          <h2 className="text-2xl font-bold">{stats.totalResponses}</h2>
        </div>
      </div>

      {/* Form Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.map((survey) => (
          <div key={survey._id} className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-xl font-bold">
              {survey.title}
            </h2>

            <p className="text-gray-500 mt-2">
              {survey.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              
              <Link
                to={`/preview/${survey._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Eye size={16} /> Preview
              </Link>

              <Link
                to={`/edit/${survey._id}`}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Pencil size={16} /> Edit
              </Link>

              <Link
                to={`/analytics/${survey._id}`}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <BarChart size={16} /> Analytics
              </Link>

              <button
  onClick={() => handleDelete(survey._id)}
  className="bg-red-600 text-white px-3 py-1 rounded"
>
  Delete
</button>

            </div>

            <div className="mt-4">
              <span className={`px-3 py-1 text-xs rounded-full ${
                survey.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {survey.isActive ? "Active" : "Inactive"}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatorDashboard;