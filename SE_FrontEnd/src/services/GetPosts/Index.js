// services/Posts/index.js
console.trace("🚨 getPosts() imported from here");

import axios from "axios";

const API_POSTS_URL = "http://localhost:8000/api/posts/getAll";

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
    return response.data; // Expected to be an object or array of posts
  } catch (error) {
    console.error("Error retrieving posts:", error.response?.data || error.message);
    throw error;
  }
};
