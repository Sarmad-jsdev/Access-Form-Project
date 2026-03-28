import { createContext, useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Use the configured axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

  const login = async (email, password) => {
  const res = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });

  // ✅ Store token
  localStorage.setItem("token", res.data.token);

  setUser(res.data.user);
  return res.data.user;
};

  const logout = async () => {
  localStorage.removeItem("token");  // 🔥 Remove token
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
