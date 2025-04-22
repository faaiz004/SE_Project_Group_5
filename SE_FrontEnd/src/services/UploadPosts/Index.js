import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const createPost = async ({ image, caption, clothes }) => {
  const token = localStorage.getItem("jwt");
  const email = localStorage.getItem("email");

  if (!token || !email) throw new Error("Missing JWT token or email");

  const formData = new FormData();
  formData.append("image", image);
  formData.append("caption", caption);
  formData.append("email", email);
  if (clothes && clothes.length > 0) {
    formData.append("clothes", JSON.stringify(clothes));
  }

  console.log("🧾 FormData being sent:");
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  const response = await axios.post(`${API_BASE_URL}/posts/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
