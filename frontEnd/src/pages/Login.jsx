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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const headingRef = useRef(null);
  const errorRef = useRef(null);

  // Show accessible info message instead of alert
  useEffect(() => {
    if (shouldShowSurveyLoginMessage) {
      setInfoMessage("Please login to fill and submit this form.");
    }
  }, [shouldShowSurveyLoginMessage]);

  // Focus page heading on mount
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const loggedInUser = await login(email, password);

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

      // Move focus to error for screen reader
      if (errorRef.current) {
        errorRef.current.focus();
      }
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4 py-8">
      <section
        className="max-w-md w-full bg-[var(--bg-primary)] rounded-2xl shadow-xl border border-[var(--border)]"
        aria-labelledby="login-heading"
      >
        <div className="p-8">

          {/* Heading */}
          <h1
            id="login-heading"
            ref={headingRef}
            tabIndex="-1"
            className="text-3xl font-extrabold text-[var(--text-primary)] mb-4 focus:outline-none"
          >
            Welcome Back
          </h1>

          <p className="text-[var(--text-secondary)] mb-6">
            {shouldShowSurveyLoginMessage
              ? "Login to fill and submit this form."
              : "Login to manage your accessible surveys."}
          </p>

          {/* Accessible Info Message */}
          {infoMessage && (
            <div
              className="mb-4 p-3 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              role="status"
              aria-live="polite"
            >
              {infoMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div
              ref={errorRef}
              tabIndex="-1"
              className="mb-4 p-3 rounded border border-red-500 text-red-600"
              role="alert"
              aria-live="assertive"
            >
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6" noValidate>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-[var(--text-primary)] mb-1"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--text-secondary)]"
                  aria-hidden="true"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="  Enter your email"
                  required
                  aria-required="true"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none"
                />
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--text-secondary)]"
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
                    <EyeOff size={20} className="text-[var(--text-secondary)]" aria-hidden="true" />
                  ) : (
                    <Eye size={20} className="text-[var(--text-secondary)]" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[var(--primary)] text-[var(--text-on-primary)]
              py-3 rounded-lg font-bold flex items-center justify-center gap-2
              focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]
              active:scale-95 transition"
            >
              Sign In
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-[var(--text-secondary)] text-sm">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
              className="text-[var(--primary)] font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded"
            >
              Create one for free
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;