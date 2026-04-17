import axios from "axios";

// IMPORTANT: VITE_API_URL must already include /api
// Example: https://your-backend.vercel.app/api

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;