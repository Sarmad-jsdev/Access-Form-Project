import { createContext, useState, useEffect } from "react";
import axios from "../axiosConfig"; // <-- use configured axios instance
const API_BASE_URL = import.meta.env.VITE_API_URL // <-- base URL for API

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const fetchUser = async () => { try { const res = await axios.get(`${API_BASE_URL}/api/auth/me`); setUser(res.data); } catch (err) { setUser(null); } finally { setLoading(false); } }; if (document.cookie.includes("token")) { fetchUser(); } else { setLoading(false); } }, []);


  // LOGIN FUNCTION
 const login = async (email, password) => {
  const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
  setUser(res.data.user);

  // Fetch current user
  const me = await axios.get(`${API_BASE_URL}/api/auth/me`);
  setUser(me.data);
  return me.data; // <-- return user
};


  // LOGOUT FUNCTION
  const logout = async () => {
    await axios.post(`${API_BASE_URL}/api/auth/logout`);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};