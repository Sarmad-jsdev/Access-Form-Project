import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, ArrowRight, ChevronDown } from "lucide-react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "respondent",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert(res.data.message);
      navigate("/login");
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

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-[var(--text-primary)]">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)]" />
                <input
                  type="text"
                  required
                  value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg 
                  border border-[var(--border)] 
                  bg-[var(--bg-primary)] 
                  text-[var(--text-primary)]
                  placeholder-[color:var(--text-primary)]
                  focus:ring-2 focus:ring-[var(--focus-ring)] 
                  outline transition appearance-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-[var(--text-primary)]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)]" />
                <input
                  type="email"
                  required
                  value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg 
                  border border-[var(--border)] 
                  bg-[var(--bg-primary)] 
                  text-[var(--text-primary)]
                  placeholder-[color:var(--text-primary)]
                  focus:ring-2 focus:ring-[var(--focus-ring)] 
                  outline transition appearance-none"
                  placeholder="example@mail.com"
                />
              </div>
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-[var(--text-primary)]">
                Select Role
              </label>
              <div className="relative">
              <ChevronDown  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)]"/>
              <select
                value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pr-10 pl-4 py-2.5 rounded-lg 
                  border border-[var(--border)] 
                  bg-[var(--bg-primary)] 
                  text-[var(--text-primary)]
                  placeholder-[color:var(--text-primary)]
                  focus:ring-2 focus:ring-[var(--focus-ring)] 
                  outline transition appearance-none"
              >
                <option value="respondent">Respondent</option>
                <option value="creator">Form Creator</option>
                <option value="admin">Admin</option>
              </select>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-[var(--text-primary)]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)]" />
                <input
                  type="password"
                  required
                  value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg 
                  border border-[var(--border)] 
                  bg-[var(--bg-primary)] 
                  text-[var(--text-primary)]
                  placeholder-[color:var(--text-primary)]
                  focus:ring-2 focus:ring-[var(--focus-ring)] 
                  outline transition appearance-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-[var(--text-primary)]">
                Confirm Password
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)]" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg 
                  border border-[var(--border)] 
                  bg-[var(--bg-primary)] 
                  text-[var(--text-primary)]
                  placeholder-[color:var(--text-primary)]
                  focus:ring-2 focus:ring-[var(--focus-ring)] 
                  outline transition appearance-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[var(--primary)] text-[var(--text-on-primary)] py-3 rounded-lg font-bold mt-4 hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              Sign Up <ArrowRight size={18} />
            </button>

          </form>

          <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link to="/Login" className="text-[var(--text-primary)] font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;