import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const Login = ({ setIsLoggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 1️⃣ LocalStorage se users nikalein
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 2️⃣ Match karein email & password
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // 3️⃣ Current user save karein
      localStorage.setItem("currentUser", JSON.stringify(foundUser));

      setIsLoggedIn(true);

      alert(`Welcome ${foundUser.role}!`);

      navigate("/Dashboard");
    } else {
      alert("Invalid Email or Password! Please try again.");
    }
  };

  return (
    <div className="min-h-[90vh] bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-center justify-center px-4 py-12 transition-colors duration-300 border-b border-[var(--border-color)] shadow-sm">
      <div className="max-w-md w-full bg-[var(--bg-primary)] rounded-2xl shadow-xl border border-[var(--border-color)] overflow-hidden">
        
        <div className="p-8">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">
              Welcome Back
            </h1>
            <p className="text-[var(--text-secondary)]">
              Login to manage your accessible surveys.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[var(--text-primary)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-[var(--text-primary)]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--primary)]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[var(--primary)] text-[var(--text-on-primary)] py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition shadow-lg"
            >
              Sign In <ArrowRight size={20} />
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-[var(--text-secondary)] text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-[var(--primary)] font-bold hover:underline">
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;