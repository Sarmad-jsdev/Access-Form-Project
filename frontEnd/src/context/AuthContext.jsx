import { createContext, useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

export const AuthContext = createContext();

 export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTO LOAD USER ON REFRESH
  // =========================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await axiosInstance.get("/auth/me");

        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // =========================
  // LOGIN FUNCTION
  // =========================
  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", {
      email,
      password,
    });



    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    return res.data.user;
  };

  // =========================
  // REGISTER AUTO LOGIN HELPER
  // =========================
  const setAuthAfterLogin = (user, token) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, setAuthAfterLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

