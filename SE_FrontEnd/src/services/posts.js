import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:8000/api/posts' });

// like
export const likePost     = (id, token) => api.post(`/${id}/like`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});

// save / unsave
export const savePost     = (id, token) => api.post(`/${id}/save`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});
export const unsavePost   = (id, token) => api.delete(`/${id}/save`, {
  headers: { Authorization: `Bearer ${token}` }
});

// fetch saved
export const fetchSaved   = (token) => api.get('/saved', {
  headers: { Authorization: `Bearer ${token}` }
});
