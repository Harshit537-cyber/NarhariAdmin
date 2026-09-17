import apiClient from "../Interceptor/apiClient"

export const getAllConsultationRatings = async (page = 1, limit = 10) => 
    {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.get(
      `/consultation-rating/admin/all-ratings?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) 
  {
    console.error("Get All Consultation Ratings API Error:", error);
    throw error.response?.data || error;
  }
};