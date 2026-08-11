import apiClient from "../Interceptor/apiClient";

export const getPendingMinRatePartners = async (page = 1, limit = 10) => {

  try {

    const response = await apiClient.get(

      `/admin/dashboard/partners/pending-min-rate?page=${page}&limit=${limit}`
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

// Approve Partner Min Rate
export const approvePartnerMinRate = async (partnerId, status) => {
  try {
    const response = await apiClient.put(
      `/admin/dashboard/partners/${partnerId}/min-rate-approval`,
      {
        status: status,
      }
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