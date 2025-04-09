// services/UploadPosts/index.js
import axios from "axios";

const API_POST_URL = "http://localhost:8000/api/posts/create";

export const createPost = async ({ image, caption, clothes }) => {
  const token = localStorage.getItem("jwt");
  const email = localStorage.getItem("email");
  if (!token || !email) throw new Error("Missing JWT token or email");

  const formData = new FormData();
  formData.append("image", image);         // image: File object
  formData.append("caption", caption);
  formData.append("email", email);         // used to look up the user
  if (clothes && clothes.length > 0) {
    formData.append("clothes", JSON.stringify(clothes));
  }

  console.log("🧾 FormData being sent:");
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  const response = await axios.post(API_POST_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
