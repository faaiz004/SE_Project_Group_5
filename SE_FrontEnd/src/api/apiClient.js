// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

/* Attach JWT automatically */
apiClient.interceptors.request.use(cfg => {
  // localStorage.setItem('jwt', 'Checking token');
  const token = localStorage.getItem('jwt');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/* Global 401 → force-login event */
apiClient.interceptors.response.use(
  res => res,
  err => {
    // console.log('--- Interceptor Triggered ---');
    // console.log('API error:', err);
    // console.log('Response data:', err.response);
    if (err.response?.status == 403) {
      // console.warn('401 - Unauthorized');
      window.dispatchEvent(new Event('force-login'));
    }
    return Promise.reject(err);
  }
);


export default apiClient;
