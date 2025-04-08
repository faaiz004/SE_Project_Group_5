import axios from "axios";

export const submitPreferences = async (preferencesData) => {
    try {
      const token = localStorage.getItem('jwt'); // JWT must be present
  
      const response = await axios.post(
        'http://localhost:8000/api/auth/submit-preferences',
        preferencesData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error('Submitting preferences failed:', error.response?.data || error.message);
      throw error;
    }
  };
  