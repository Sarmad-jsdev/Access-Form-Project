import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import axiosInstance from "../axiosConfig";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Reference for focusing error message
  const errorRef = useRef(null);

  // Form data (single source of truth)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "respondent",
    password: "",
    confirmPassword: "",
  });

  // Global error (API / submit)
  const [error, setError] = useState("");

  // Field-level errors
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  // Focus on error when it appears
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "At least 3 characters required";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const validationErrors = validate();

    // Stop if validation fails
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/api/auth/register", formData);

      navigate(`/login?redirect=${redirectPath}`, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle input change + clear field error
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Clear error for that field
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <main className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4 py-12">
      <section className="max-w-xl w-full bg-[var(--bg-primary)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT SIDE */}
        <div className="md:w-2/5 bg-[var(--primary)] p-8 text-[var(--text-on-primary)] flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-4">Join the Movement</h1>
          <p className="text-sm opacity-90">
            Create an account to build surveys everyone can answer.
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="md:w-3/5 p-8">
          <form onSubmit={handleRegister} className="space-y-4" noValidate>

            {/* GLOBAL ERROR */}
            {error && (
              <div
                ref={errorRef}
                tabIndex="-1"
                className="p-3 bg-red-100 text-red-700 border border-red-300 rounded"
              >
                {error}
              </div>
            )}

            {/* NAME */}
            <div>
              <label className="text-xs font-bold">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-xs font-bold">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* ROLE */}
            <label className="text-xs font-bold">Role</label>
            <select
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="respondent">Respondent</option>
              <option value="creator">Form Creator</option>
            </select>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-bold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                  className="w-full pl-10 pr-10 py-2 border rounded-lg"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-xs font-bold">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                className="w-full pl-10 pr-10 py-2 border rounded-lg"
                placeholder="Confirm Password"
              />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center items-center gap-2"
            >
              {loading ? "Creating..." : "Sign Up"}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to={`/login?redirect=${redirectPath}`}>
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
