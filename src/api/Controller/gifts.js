import apiClient from "../Interceptor/apiClient";


export const getAllGifts = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.get(
      `/gift/admin/gift/all?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Get All Gifts API Error:", error);
    throw error.response?.data || error;
  }
};