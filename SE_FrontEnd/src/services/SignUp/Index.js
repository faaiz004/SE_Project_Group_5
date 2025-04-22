import axios from 'axios';

// Use environment variable for dynamic base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { token, user } = response.data;
    const email = user?.email;

    if (token) {
      localStorage.setItem('jwt', token);
      localStorage.setItem('email', email);
    }

    return response.data;
  } catch (error) {
    console.error('Signup failed:', error.response?.data || error.message);
    throw error;
  }
};
