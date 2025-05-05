// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/login/api', //URL de producción revisar porque no me acuerdo
});

export default api;
