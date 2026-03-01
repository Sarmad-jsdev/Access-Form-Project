import { createContext, useState, useEffect } from "react";
import axios from "axios";

// VERY IMPORTANT
axios.defaults.withCredentials = true;
export const AuthContext = createContext();

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`);
      setUser(res.data);
    } catch (err) {
      // Only set user to null, don't log 401
      if (err.response && err.response.status === 401) {
        setUser(null); 
      } else {
        console.error("Failed to fetch user:", err); // only unexpected errors
      }
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


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