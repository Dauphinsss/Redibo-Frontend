import axios from 'axios';
import { API_URL } from '@/utils/bakend';

const axiosInstance = axios.create({
  baseURL: "https://backend-is.vercel.app/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosInstance2 = axios.create({
  baseURL: `${API_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export { axiosInstance, axiosInstance2 };