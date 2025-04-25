import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use(cfg => {
  const token = localStorage.getItem('jwt');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

apiClient.interceptors.response.use(
  res => res,
  err => {

    if (err.response?.status == 403) {
      window.dispatchEvent(new Event('force-login'));
    }
    return Promise.reject(err);
  }
);


export default apiClient;
