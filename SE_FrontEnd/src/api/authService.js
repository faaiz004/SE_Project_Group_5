import apiClient from './apiClient.js';

const persist = ({ token, user }) => {
  if (!token) return;
  localStorage.setItem('jwt', token);
  localStorage.setItem('email', user?.email || '');
  if (user?.preferencesCompleted !== undefined) {
    localStorage.setItem('preferencesCompleted', user.preferencesCompleted);
  }
};

/* Utility to clear storage */
const clearStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
};
// signupUser
export const signupUser = async (userData) => {
  clearStorage();
  const { data } = await apiClient.post('/auth/signup', userData);
  persist(data);
  return data;
};

export const loginConvention = async (email, password) => {
  clearStorage();
  const { data } = await apiClient.post('/auth/login', { email, password });
  persist(data);
  return data;
};

export const submitPreferences = async (prefs) => {
  const { data } = await apiClient.post('/auth/submit-preferences', prefs);
  if (data?.preferencesCompleted !== undefined) {
    localStorage.setItem('preferencesCompleted', data.preferencesCompleted);
  }
  return data;
};

export const loginWithGoogle = async (googleToken) => {
  clearStorage();
  const { data } = await apiClient.post('/auth/google', { token: googleToken });
  persist(data);
  return data;
};

export const getPreferences = async () => {
  const { data } = await apiClient.get('/auth/get-preferences');
  return data;  
};

export const updatePreferences = async (prefs) => {
  const { data } = await apiClient.post('/auth/update-preferences', prefs);
  return data;  
};


