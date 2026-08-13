
import apiClient from "../Interceptor/apiClient";

// Get All Pandits
export const getAllPandits = async (page = 1, limit = 10) => {

  try {

    const response = await apiClient.get(

      `/admin/pandit/get-pandits?page=${page}&limit=${limit}`
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


// Delete Pandit Controller

export const deletePandit = async (id) => {

  const token = localStorage.getItem("token");

  const response = await apiClient .delete(

    `/admin/pandit/delete-pandit/${id}`,
    {
      headers: {
        
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const updatePandit = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.put(

      `/admin/pandit/update-pandit/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,

          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {

    console.error("Update Pandit API Error:", error);
    throw error.response?.data || error;
  }
};