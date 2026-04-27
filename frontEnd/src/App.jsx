import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./Components/Navbar";
import Footer from "./Components/footer";
import ScrollToTop from "./Components/ScrollToTop";

import Home from "./pages/Home";
import Aboutus from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Settings from "./pages/settings";

import Login from "./pages/Login";
import Register from "./pages/Register";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUser";
import AdminSurveys from "./pages/AdminSurveys";
import AdminSurveyPreview from "./pages/AdminSurveyPreview";


import CreatorDashboard from "./pages/CreatorDashboard";
import CreateForm from "./pages/CreateForm";
import PreviewSurvey from "./pages/PreviewSurvey";
import SurveyAnalytics from "./pages/SurveyAnalytics";


import SurveyPage from "./pages/SurveyPage";
import Respondant from "./pages/Respondant";


import DashboardSettings from "./pages/DashboardSettings";
import PublicLayout from "./Components/PublicLayout";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* TOASTER */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            },
          }}
        />

        <ScrollToTop />

        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />

          <Route
            path="/about"
            element={
              <>
                <PublicLayout>
                  <Aboutus />
                </PublicLayout>
              </>
            }
          />

          <Route
            path="/contact"
            element={
              <>
                <PublicLayout>
                  <ContactUs />
                </PublicLayout>
              </>
            }
          />

          <Route
            path="/settings"
            element={
              <>
                <PublicLayout>
                  <Settings />
                </PublicLayout>
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                <PublicLayout>
                  <Login />
                </PublicLayout>
              </>
            }
          />

          <Route
            path="/register"
            element={
              <>
                <PublicLayout>
                  <Register />
                </PublicLayout>
              </>
            }
          />

          {/* ================= DASHBOARD ROUTES ================= */}

          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <DashboardSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Respondent"
            element={
              <ProtectedRoute role="respondent">
                <Respondant />
              </ProtectedRoute>
            }
          />

          <Route
            path="/survey/:id"
            element={
              <ProtectedRoute role="respondent">
                <SurveyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/AdminDashboard"
            element={
              <ProtectedRoute  role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute  role="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/surveys"
            element={
              <ProtectedRoute  role="admin">
                <AdminSurveys />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/surveys/preview/:id" element={
              <ProtectedRoute  role="admin">
                <AdminSurveyPreview />
              </ProtectedRoute>
            }
           />
          

          <Route
            path="/CreatorDashboard"
            element={
              <ProtectedRoute role="creator">
                <CreatorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/CreateForm"
            element={
              <ProtectedRoute role="creator">
                <CreateForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/preview/:id"
            element={
              <ProtectedRoute role="creator">
                <PreviewSurvey />
              </ProtectedRoute>
            }
          />

          <Route
            path="/creator/analytics/:id"
            element={
              <ProtectedRoute role="creator">
                <SurveyAnalytics />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
