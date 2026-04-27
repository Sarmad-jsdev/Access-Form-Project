import React, { useState, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import axiosInstance from "../axiosConfig";
import FieldError from "../Components/InlineError";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login, setAuthAfterLogin } = useContext(AuthContext);

  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const isSurveyRegister =
  redirectPath && redirectPath.startsWith("/");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "respondent",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    } else if (formData.name.length < 3) {
      newErrors.name = "Minimum 3 characters required";
    }

    if (!formData.email) {
      newErrors.email = "Please enter your email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Please provide your password";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Must contain at least 1 uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Must contain at least 1 number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // ---------------- REGISTER ----------------
  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      // =========================
      // STEP 1: REGISTER
      // =========================
      const res = await axiosInstance.post("/auth/register", formData);

      const { user, token } = res.data;

      toast.success("Account created 🎉 Logging you in...");

      // =========================
      // STEP 2: AUTO LOGIN (IMPORTANT FIX)
      // =========================
      setAuthAfterLogin(user, token);

      setShowOverlay(true);

      // =========================
      // STEP 3: REDIRECT FIX
      // =========================
      setTimeout(() => {
        let path = redirectPath;

        // ✅ FIX: proper decode + strict check
        if (path) {
          try {
            path = decodeURIComponent(path);
          } catch (e) {
            path = null;
          }
        }

        // =========================
        // FINAL REDIRECT FIX
        // =========================
        if (path && path.startsWith("/")) {
          navigate(path, { replace: true }); // 🎯 SURVEY ALWAYS WORKS
        } else {
          if (user.role === "admin") navigate("/AdminDashboard");
          else if (user.role === "creator") navigate("/CreatorDashboard");
          else navigate("/Respondent");
        }
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <main className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4 py-12 relative">
      {/* OVERLAY */}
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
          <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-xl border border-[var(--border)] text-center">
            <h2 className="text-[var(--primary)] font-bold text-lg mb-2">
              Registration Successful
            </h2>
            <p className="text-[var(--text-secondary)]">Redirecting...</p>
          </div>
        </div>
      )}

      {/* CARD */}
      <section
        className={`max-w-3xl w-full bg-[var(--bg-primary)] rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col md:flex-row transition-all duration-300 ${
          showOverlay
            ? "blur-sm scale-[0.98] opacity-70 pointer-events-none"
            : ""
        }`}
      >
        {/* LEFT SIDE */}
        <div className="md:w-2/5 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] p-8 text-[var(--text-on-primary)] flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-3 leading-snug">
            {isSurveyRegister
              ? "Join to Continue Your Survey"
              : "Create Your Account"}
          </h1>

          <p className="text-sm opacity-90 leading-relaxed">
            {isSurveyRegister
              ? "It looks like you were trying to access a survey. Please create an account to continue."
              : "Join our community of survey creators and respondents. Create, share, and analyze surveys with ease!"}
          </p>

        </div>

        {/* FORM SIDE */}
        <div className="md:w-3/5 p-8 bg-[var(--bg-primary)]">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)]">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-[var(--focus-ring)] outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <FieldError message={errors.name} />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-[var(--focus-ring)] outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <FieldError message={errors.email} />
            </div>

            {/* ROLE */}
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)]">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full p-2.5 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl"
              >
                <option value="respondent">Respondent</option>
                <option value="creator">Form Creator</option>
              </select>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  placeholder="Enter your password"
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-[var(--focus-ring)] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError message={errors.password} />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  placeholder="Confirm Password"
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className="w-full pl-10 pr-10 py-2.5 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword} />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-[var(--text-on-primary)] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
            >
              {loading ? "Creating..." : "Sign Up"}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center mt-5 text-md text-[var(--text-primary)]">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${redirectPath}`}
              className="text-[var(--primary)] font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
