import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ Send cookies across domains
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add response interceptor to handle token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/Login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
