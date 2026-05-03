import axios from "axios";

const api = axios.create({
  // If I'm on my laptop, use 3000. If I'm on Render, use the API link.
  baseURL: import.meta.env.DEV 
    ? "http://localhost:3000" 
    : import.meta.env.VITE_API_URL , 
  withCredentials: true,
});

export default api;

// import axios from "axios";

// const api = axios.create({
//   // This automatically picks the right URL based on where the app is running
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
//   withCredentials: true,
// });

// export default api;