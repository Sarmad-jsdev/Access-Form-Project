import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Eye, EyeOff
} from "lucide-react";
import axiosInstance from "../axiosConfig";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const errorRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "respondent",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/auth/register", formData);

      navigate(`/login?redirect=${redirectPath}`, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4 py-12">
      <section
        className="max-w-xl w-full bg-[var(--bg-primary)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col md:flex-row"
        aria-labelledby="register-heading"
      >
        {/* Left Section */}
        <div className="md:w-2/5 bg-[var(--primary)] p-8 text-[var(--text-on-primary)] flex flex-col justify-center">
          <h1 id="register-heading" className="text-2xl font-bold mb-4">
            Join the Movement
          </h1>
          <p className="text-sm opacity-90 leading-relaxed">
            Create an account to build surveys everyone can answer.
          </p>
        </div>

        {/* Form Section */}
        <div className="md:w-3/5 p-8 flex flex-col justify-center">
          <form onSubmit={handleRegister} noValidate className="space-y-4">

            {/* Accessible Error Message */}
            {error && (
              <div
                ref={errorRef}
                tabIndex="-1"
                role="alert"
                aria-live="assertive"
                className="p-3 rounded-lg bg-red-100 text-red-700 border border-red-300 focus:outline-none"
              >
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="text-xs font-bold uppercase text-[var(--text-primary)]"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)]"
                />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase text-[var(--text-primary)]"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)]"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none"
                />
              </div>
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="role"
                className="text-xs font-bold uppercase text-[var(--text-primary)]"
              >
                Select Role
              </label>
              <div className="relative">
                
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full pr-10 pl-2 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none"
                >
                  <option value="respondent">Respondent</option>
                  <option value="creator">Form Creator</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-[var(--text-primary)] mb-1"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)]"
                  aria-hidden="true"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  aria-required="true"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none"
                />

                {/* Accessible Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                  focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
                  rounded"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-[var(--text-secondary)] w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye size={20} className="text-[var(--text-secondary)] w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-bold text-[var(--text-primary)] mb-1"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-primary)]"
                  aria-hidden="true"
                />

                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  aria-required="true"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none"
                />

                {/* Accessible Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                  focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
                  rounded"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-[var(--text-secondary)] w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye size={20} className="text-[var(--text-secondary)] w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] text-[var(--text-on-primary)] py-3 rounded-lg font-bold mt-4 hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Sign Up"}
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${redirectPath}`}
              className="font-bold text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--focus-ring)] rounded"
            >
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;