import axios from "axios";

// Use environment variable for dynamic base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const submitPreferences = async (preferencesData) => {
    try {
        const token = localStorage.getItem('jwt');

        if (!token) {
            throw new Error("Missing JWT token in localStorage.");
        }

        const response = await axios.post(
            `${API_BASE_URL}/auth/submit-preferences`,
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
