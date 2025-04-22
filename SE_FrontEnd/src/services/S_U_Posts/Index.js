import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper to get JWT from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    console.log("Token from localStorage:", token);
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

// Save Post
export const saveClothes = async (postId) => {
    const token = localStorage.getItem('jwt');
    console.log("Token from localStorage:", token);
    try {
        const response = await axios.post(
            `${API_BASE_URL}/clothes/saveClothes/${postId}`,
            {},
            { headers: getAuthHeader() }
        );
        console.log("Post saved successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error('Save post failed:', error.response?.data || error.message);
        throw error;
    }
};

// Unsave Post
export const unsaveClothes = async (postId) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/clothes/unsaveClothes/${postId}`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        console.error('Unsave post failed:', error.response?.data || error.message);
        throw error;
    }
};

// Get All Saved Posts
export const getSavedClothes = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/clothes/savedClothes`,
            { headers: getAuthHeader() }
        );
        return response.data.clothes;
    } catch (error) {
        console.error('Fetching saved posts failed:', error.response?.data || error.message);
        throw error;
    }
};
