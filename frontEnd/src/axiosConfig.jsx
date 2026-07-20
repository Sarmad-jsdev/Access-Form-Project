import axios from "axios";

// Create an Axios instance with a base URL 

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