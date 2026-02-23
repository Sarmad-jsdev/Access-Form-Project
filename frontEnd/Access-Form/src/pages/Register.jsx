import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("respondent");

  {/* Form data state */}
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = (e) => {
    e.preventDefault();

    // ✅ Empty fields check
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields!");
      return;
    }

    // ✅ Password match check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const existingUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    // ✅ Duplicate email check
    const emailExists = existingUsers.find(
      (user) => user.email === formData.email
    );

    if (emailExists) {
      alert("Email already registered!");
      return;
    }

    const newUser = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: role,
    };

    localStorage.setItem(
      "users",
      JSON.stringify([...existingUsers, newUser])
    );

    alert(`Registered as ${role}! Please login.`);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-[var(--bg-primary)] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col md:flex-row">

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
              <label className="text-xs font-bold uppercase">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg"
                  placeholder="example@mail.com"
                />
              </div>
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase">
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 border rounded-lg"
              >
                <option value="respondent">Respondent</option>
                <option value="creator">Form Creator</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg"
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

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--primary)] font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;