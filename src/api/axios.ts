import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://backend-is.vercel.app/",
  //baseURL: "http://localhost:4000/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;