import axios from "axios";

// Use environment variable for dynamic base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getPurchases = async () => {
    const token = localStorage.getItem('jwt');
    const email = localStorage.getItem('email');

    if (!token || !email) {
        throw new Error("Missing JWT or email in localStorage.");
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/clothes/purchased`, { email }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch purchases:', error.response?.data || error.message);
        throw error;
    }
};
