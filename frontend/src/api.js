import axios from "axios";

// Backend base URL
const API = axios.create({ baseURL: "http://localhost:5000" });

// Add JWT token to every request if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
