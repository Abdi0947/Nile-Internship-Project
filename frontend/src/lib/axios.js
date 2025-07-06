import axios from 'axios';

// server Url
const fallbackURL = "https://nile-intership-project.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || fallbackURL,
  withCredentials: true,
});

export default axiosInstance;