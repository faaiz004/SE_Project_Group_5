import axios from "axios";

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

const API_POSTS_URL = `${API_BASE_URL}/posts/getAll`;

export const getPosts = async () => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    throw new Error("Missing JWT token in localStorage.");
  }

  try {
    const response = await axios.get(API_POSTS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error retrieving posts:", error.response?.data || error.message);
    throw error;
  }
};
