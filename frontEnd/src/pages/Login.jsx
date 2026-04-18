import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import FieldError from "../Components/InlineError";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectPath = searchParams.get("redirect");

  const isSurveyLogin = Boolean(redirectPath);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOverlay, setShowOverlay] = useState(false);

  const validate = () => {
    const err = {};

    if (!form.email) err.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email";

    if (!form.password) err.password = "Password required";
    else if (form.password.length < 6)
      err.password = "Min 6 characters required";

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    try {
      setLoading(true);

      const user = await login(form.email, form.password);

      setShowOverlay(true);
      toast.success("Login successful 🎉");

      setTimeout(() => {
        let path = redirectPath;

        if (path) {
          try {
            path = decodeURIComponent(path);
          } catch (e) {
            path = null;
          }
        }

        if (path && path.startsWith("/")) {
          navigate(path, { replace: true });
          return;
        }

        if (user.role === "admin") navigate("/AdminDashboard");
        else if (user.role === "creator") navigate("/creator-dashboard");
        else navigate("/Respondent");
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--text-primary)] px-4">
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
          <div className="bg-[var(--bg-secondary)] p-6 rounded-xl text-center shadow-xl border border-[var(--border)]">
            <h2 className="text-[var(--primary)] font-bold text-lg">
              Login Successful
            </h2>
            <p className="text-[var(--text-secondary)]">Redirecting...</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[var(--bg-primary)] p-8 rounded-2xl shadow-lg border border-[var(--border)] space-y-5"
      >
        {/* ✅ CONDITIONAL HEADING ONLY */}
        <h1 className="text-2xl font-bold text-center">
          {isSurveyLogin ? "Login first to fill the survey" : "Welcome Back"}
        </h1>

        {/* EMAIL */}
        <div>
          <label className="text-sm">Email</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              className="w-full pl-10 pr-3 py-2 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--focus-ring)] outline-none"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <FieldError message={errors.email} />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm">Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />

            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-10 py-2 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--focus-ring)] outline-none"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <FieldError message={errors.password} />
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-[var(--text-on-primary)] py-2 rounded-lg flex items-center justify-center gap-2 font-semibold transition"
        >
          {loading ? "Logging in..." : "Login"}
          <ArrowRight size={16} />
        </button>

        {/* INFO */}
        {redirectPath && (
          <p className="text-xs text-center text-[var(--text-secondary)]">
            You must login to continue your survey
          </p>
        )}

        {/* REGISTER */}
        <p className="text-center text-sm text-[var(--text-primary)]">
          Don't have an account?{" "}
          <Link className="text-[var(--primary)] font-semibold" to={redirectPath ? `/register?redirect=${encodeURIComponent(redirectPath)}` : "/register"}>
            Register
          </Link>
        </p>    
      </form>
    </div>
  );
};

export default Login;
