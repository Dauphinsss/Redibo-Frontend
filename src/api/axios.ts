import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://backend-is.vercel.app/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;