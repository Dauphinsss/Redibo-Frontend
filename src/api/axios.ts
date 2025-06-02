import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://is-ps-back.vercel.app/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;