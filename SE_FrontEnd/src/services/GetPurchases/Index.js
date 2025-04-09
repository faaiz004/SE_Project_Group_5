import axios from "axios";

const API_BASE_URL = 'http://localhost:8000/api/clothes'; // or /api/clothes if that’s the correct base

export const getPurchases = async () => {
    const token = localStorage.getItem('jwt');
    const email = localStorage.getItem('email');

    if (!token || !email) {
        throw new Error("Missing JWT or email in localStorage.");
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/purchased`, { email }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch changes:', error.response?.data || error.message);
        throw error;
    }
};
