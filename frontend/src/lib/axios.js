import axios from 'axios';

// server Url
const fallbackURL = "http://51.21.182.82:5003/api/";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || fallbackURL,
  withCredentials: true,
});

export default axiosInstance;