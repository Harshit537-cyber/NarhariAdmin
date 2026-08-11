import apiClient from "../Interceptor/apiClient";


// Add Ritual
export const addRitual = async (data) => {
  try {
    const response = await apiClient.post(
      "/rituals/admin/ritual/add",
      data
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Something went wrong",
      }
    );
  }
};

// Get All Rituals
export const getAllRituals = async () => {

  try {

    const response = await apiClient.get("/rituals/rituals");

    return response.data;

  } catch (error) {
    
    throw (
      error.response?.data || {

        message: "Something went wrong",
      }
    );
  }
};