import { createContext, useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          setLoading(false); // FIXED
          return;
        }

        const res = await axiosInstance.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false); // ALWAYS STOP LOADING
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};