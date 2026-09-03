import apiClient from "../Interceptor/apiClient";

export const getAdminVideos= async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.get(
      `/video-blogs/admin/all?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Get All Video Blogs API Error:", error);
    throw error.response?.data || error;
  }
};


export const updateVideo = async (id, data) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.put(
      `/video-blogs/admin/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      ...response.data,
      success: true,
    };
  } catch (error) {
    console.error("Update Video Blog API Error:", error);
    throw error.response?.data || error;
  }
};

export const createVideo = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.post(
      `/video-blogs/admin/add`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      ...response.data,
      success: true,
    };
  } catch (error) {
    console.error("Add Video Blog API Error:", error);

    throw error.response?.data || error;
  }
};

export const deleteVideo = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.delete(
      `/video-blogs/admin/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      ...response.data,
      success: true,
    };
  } catch (error) {
    console.error("Delete Video Blog API Error:", error);

    throw error.response?.data || error;
  }
};