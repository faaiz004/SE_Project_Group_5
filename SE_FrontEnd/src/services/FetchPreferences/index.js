// src/services/preferences.js

// You can also swap this out for an env variable if you like:
// const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const API_BASE = 'http://localhost:8000';

export const getUserPreferences = async () => {
  const token = localStorage.getItem('jwt');
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE}/api/auth/fetch-preferences`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch preferences (${res.status})`);
  }

  console.log('Response:', res);

  return res.json(); // { message, preferences: { gender, shirtSize, pantSize } }
};

export const updateUserPreferences = async (prefs) => {
  const token = localStorage.getItem('jwt');
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE}/api/auth/update-preferences`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prefs)
  });

  if (!res.ok) {
    throw new Error(`Failed to update preferences (${res.status})`);
  }

  return res.json();
};