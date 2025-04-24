import axios from "axios";

// Use environment variable for base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const loginConvention = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const { token, user } = response.data;
        const userEmail = user?.email 

        if (token) {
            localStorage.setItem('jwt', token);
            localStorage.setItem('email', userEmail); // Save email to localStorage

        }

        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
    }
};
