import apiClient from "../Interceptor/apiClient";


// Get All Partners
export const getAllPartners = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard/all-partners");

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Something went wrong",
      }
    );
  }
};

// Delete Partner
export const deletePartner = async (partnerId) => {

  try {
    const response = await apiClient.delete(

      `/admin/dashboard/partners/${partnerId}`
    );
    return response.data;

  } catch (error) 
  {

    throw (

      error.response?.data || {

        message: "Something went wrong",

      }
    );
  }
};


// Update Partner
export const updatePartner = async (partnerId, data) => {
  try {
    const response = await apiClient.put(
      `/api/admin/dashboard/partners/${partnerId}`,
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