// src/api/authService.js
import apiClient from './apiClient.js';

const persist = ({ token, user }) => {
  if (!token) return;
  localStorage.setItem('jwt', token);
  localStorage.setItem('email', user?.email || '');
  if (user?.preferencesCompleted !== undefined) {
    localStorage.setItem('preferencesCompleted', user.preferencesCompleted);
  }
};

export const signupUser = async userData => {
  const { data } = await apiClient.post('/auth/signup', userData);
  persist(data);
  return data;
};

export const loginConvention = async (email, password) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  persist(data);
  return data;
};

export const submitPreferences = async prefs => {
  const { data } = await apiClient.post('/auth/submit-preferences', prefs);
  if (data?. preferencesCompleted !== undefined) {
    localStorage.setItem('preferencesCompleted', data.preferencesCompleted);
  }
  return data;
};
