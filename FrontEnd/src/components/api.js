// api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://fdrs-backend.up.railway.app' // or use environment variable
});

// Add a response interceptor
api.interceptors.response.use(response => {
  // Your interceptor code...
  return response;
}, async error => {
  // Your error handling logic...
});

export default api;
