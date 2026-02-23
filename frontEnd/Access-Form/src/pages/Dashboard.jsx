import React from 'react';
import { Plus, Eye, Send, Users, BarChart } from 'lucide-react';

const Dashboard = () => {
  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const role = user?.role || 'respondent';

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Welcome, {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* --- FORM CREATOR & ADMIN SECTION --- */}
        {(role === 'creator' || role === 'admin') && (
          <>
            <button className="flex flex-col items-center justify-center p-8 bg-[var(--primary)] text-[var(--text-on-primary)] rounded-2xl shadow-lg hover:scale-105 transition">
              <Plus size={40} />
              <span className="mt-4 font-bold">Create New Form</span>
            </button>

            <button className="flex flex-col items-center justify-center p-8 bg-white border border-[var(--border-color)] text-[var(--text-primary)] rounded-2xl shadow-md hover:bg-gray-50 transition">
              <Eye size={40} className="text-[var(--primary)]" />
              <span className="mt-4 font-bold">Preview My Forms</span>
            </button>

            <button className="flex flex-col items-center justify-center p-8 bg-white border border-[var(--border-color)] text-[var(--text-primary)] rounded-2xl shadow-md hover:bg-gray-50 transition">
              <Send size={40} className="text-blue-500" />
              <span className="mt-4 font-bold">Publish & Share</span>
            </button>
          </>
        )}

        {/* --- RESPONDENT SECTION --- */}
        {role === 'respondent' && (
          <div className="col-span-full bg-white p-8 rounded-2xl shadow-md border border-[var(--border-color)]">
            <h2 className="text-xl font-bold mb-4">Available Surveys for You</h2>
            <p className="text-[var(--text-secondary)]">No surveys available at the moment. Check back later!</p>
          </div>
        )}

        {/* --- ADMIN ONLY STATS --- */}
        {role === 'admin' && (
          <div className="col-span-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl shadow border border-[var(--border-color)] flex items-center gap-4">
              <Users className="text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">1,240</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border border-[var(--border-color)] flex items-center gap-4">
              <BarChart className="text-green-600" />
              <div>
                <p className="text-sm text-gray-500">System Traffic</p>
                <p className="text-2xl font-bold">High</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
