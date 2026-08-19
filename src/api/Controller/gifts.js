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

export const addGift = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.post(

      `/gift/admin/add-gift`,

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
    console.error("Add Gift API Error:", error);
    throw error.response?.data || error;
  }
};



export const editGift = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.put(
      `/gift/admin/edit-gift/${id}`,
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
    console.error("Edit Gift API Error:", error);
    throw error.response?.data || error;
  }
};


export const deleteGift = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.delete(
      `/gift/admin/gift/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Delete Gift API Error:", error);
    throw error.response?.data || error;
  }
};