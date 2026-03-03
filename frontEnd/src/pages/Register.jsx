import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, ArrowRight, ChevronDown } from "lucide-react";
import axiosInstance from "../axiosConfig";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard"; // fallback

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "respondent",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      // Registration API call
      const res = await axiosInstance.post("/api/auth/register", formData);

      alert(res.data.message);

      // ✅ After successful registration, navigate to login page with redirect
      navigate(`/login?redirect=${redirectPath}`, { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-[var(--bg-primary)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Info Section */}
        <div className="md:w-2/5 bg-[var(--primary)] p-8 text-[var(--text-on-primary)] flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
          <p className="text-sm opacity-90 leading-relaxed">
            Create an account to build surveys that everyone can answer. 100% WCAG compliant.
          </p>
        </div>

        {/* Form Section */}
        <div className="md:w-3/5 p-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
            Create Account
          </h1>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name, Email, Role, Password, Confirm Password */}
            {/* ...same as your previous input fields... */}

            <button
              type="submit"
              className="w-full bg-[var(--primary)] text-[var(--text-on-primary)] py-3 rounded-lg font-bold mt-4 hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              Sign Up <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link to={`/login?redirect=${redirectPath}`} className="text-[var(--text-primary)] font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;