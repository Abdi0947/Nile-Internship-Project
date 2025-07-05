import axios from 'axios';

const fallbackURL = "https://nile-internship-project.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || fallbackURL,
  withCredentials: true,
});

export default axiosInstance;