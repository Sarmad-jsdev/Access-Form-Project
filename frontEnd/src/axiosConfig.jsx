// src/axiosConfig.js
import axios from "axios";

const API_BASE_URL = "https://access-form-project.vercel.app";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // IMPORTANT! Send cookies
});

export default axiosInstance;