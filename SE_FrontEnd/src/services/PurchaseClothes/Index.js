import axios from "axios";

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

const API_PURCHASE_CLOTHES_URL = `${API_BASE_URL}/clothes/purchase`;

export const purchaseClothes = async (clothesId) => {
  const token = localStorage.getItem("jwt");
  const email = localStorage.getItem("email");

  if (!token) {
    throw new Error("Missing JWT token in localStorage.");
  }

  if (!email) {
    throw new Error("Missing user email in localStorage.");
  }

  try {
    const response = await axios.post(
      API_PURCHASE_CLOTHES_URL,
      { email, clothesId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error purchasing clothes:", error.response?.data || error.message);
    throw error;
  }
};
