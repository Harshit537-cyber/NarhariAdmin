import apiClient from "../Interceptor/apiClient";

export const getNotificationHistory = async (page = 1, limit = 10) => {

  try {

    const token = localStorage.getItem("token");

    const response = await apiClient.get(

      `/admin/notifications/history?page=${page}&limit=${limit}`,
      {
        headers: {

          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {

    console.error("Get Notification History API Error:", error);
    throw error.response?.data || error;
  }
};


export const sendNotification = async (payload) => {

  try 
  {
    const token = localStorage.getItem("token");

    const response = await apiClient.post(
      `/admin/notifications/send`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Send Notification API Error:", error);

    throw error.response?.data || error;
  }
};



export const deleteNotification = async (id) => {
  try 
  {
    const token = localStorage.getItem("token");

    const response = await apiClient.delete(
      `/admin/notifications/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {

    console.error("Delete Notification API Error:", error);

    throw error.response?.data || error;

  }
};