import axios from "axios";

const API_URL = "https://food-delivery-vigr.onrender.com/api/comments"; // Change if needed

export const fetchComments = async (foodId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${foodId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const addComment = async (foodId, text, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/${foodId}`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const deleteComment = async (commentId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
