import axios from "axios";


const API_BASE_URL = 'http://localhost:8000/api/auth';
export const loginConvention = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const { token } = response.data;

        if (token) {
            localStorage.setItem('jwt', token);
        }

        return response.data;
    }
    catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
    }
}