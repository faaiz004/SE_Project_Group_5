import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/auth';

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { token, user } = response.data;
    const email = response.data.user.email;

    if (token) {
      // ✅ Save token to localStorage
      localStorage.setItem('jwt', token);
      localStorage.setItem('email', email); // Save email to localStorage
    }

    return response.data;
  } catch (error) {
    console.error('Signup failed:', error.response?.data || error.message);
    throw error;
  }
};
