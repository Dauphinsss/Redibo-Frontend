import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://backend-is.vercel.app/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosInstance2 = axios.create({
  baseURL: "https://backend-is.vercel.app/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export { axiosInstance, axiosInstance2 };