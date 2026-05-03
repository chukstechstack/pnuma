import axios from "axios";

const api = axios.create({
  // If I'm on my laptop, use 3000. If I'm on Render, use the API link.
  baseURL: import.meta.env.DEV 
    ? "http://localhost:3000" 
    : "https://onrender.com", 
  withCredentials: true,
});

export default api;

