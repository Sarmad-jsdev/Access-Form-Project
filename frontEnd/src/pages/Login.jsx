import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectPath = searchParams.get("redirect") || "/dashboard";
  const shouldShowSurveyLoginMessage = redirectPath.startsWith("/survey/");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // API error
  const [errors, setErrors] = useState({}); // field errors
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const headingRef = useRef(null);
  const errorRef = useRef(null);

  // Show survey login message
  useEffect(() => {
    if (shouldShowSurveyLoginMessage) {
      setInfoMessage("Please login to fill and submit this form.");
    }
  }, [shouldShowSurveyLoginMessage]);

  // Focus heading on load
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    return newErrors;
  };

  // ---------------- HANDLE LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const validationErrors = validate();

    // Stop if validation fails
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const loggedInUser = await login(email, password);

      // Redirect logic
      if (redirectPath && redirectPath !== "/dashboard") {
        navigate(redirectPath, { replace: true });
        return;
      }

      if (loggedInUser.role === "admin") {
        navigate("/AdminDashboard", { replace: true });
      } else if (loggedInUser.role === "creator") {
        navigate("/creator-dashboard", { replace: true });
      } else if (loggedInUser.role === "respondent") {
        navigate("/Respondent", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setErrorMessage(message);

      if (errorRef.current) {
        errorRef.current.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle input change + clear field error
  const handleChange = (field, value) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    setErrors({ ...errors, [field]: "" });
  };

  return (
    <main className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4 py-8">
      <section className="max-w-md w-full bg-[var(--bg-primary)] rounded-2xl shadow-xl border border-[var(--border)]">
        <div className="p-8">

          {/* HEADING */}
          <h1
            ref={headingRef}
            tabIndex="-1"
            className="text-3xl font-extrabold mb-4"
          >
            Welcome Back
          </h1>

          <p className="mb-6">
            {shouldShowSurveyLoginMessage
              ? "Login to fill and submit this form."
              : "Login to manage your accessible surveys."}
          </p>

          {/* INFO MESSAGE */}
          {infoMessage && (
            <div className="mb-4 p-3 rounded bg-gray-100">
              {infoMessage}
            </div>
          )}

          {/* API ERROR */}
          {errorMessage && (
            <div
              ref={errorRef}
              tabIndex="-1"
              className="mb-4 p-3 border border-red-500 text-red-600 rounded"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6" noValidate>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-bold mb-1 block">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    handleChange("email", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-bold mb-1 block">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                  className="w-full pl-10 pr-10 py-2 border rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* REGISTER LINK */}
          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link to={`/register?redirect=${redirectPath}`}>
              Create one
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
