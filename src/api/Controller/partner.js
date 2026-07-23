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

// Update Partner
export const updatePartner = async (partnerId, data) => 
  {
  try {

    const response = await apiClient.put(

      `/admin/dashboard/partners/${partnerId}`,

      data,
      {
        headers: {

          "Content-Type": "application/json",
        },
      }
    );
    return response.data;

  } 
  catch (error) {
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
      `/admin/dashboard/partner/${partnerId}`
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

// Activate Partner
export const activatePartner = async (partnerId) => {
  try {
    const response = await apiClient.put(
      `/admin/dashboard/partners/${partnerId}/activate`
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

// Deactivate Partner (backend requires "reason" and "reasonNote" in body)
export const deactivatePartner = async (
  partnerId,
  reason = "Deactivated by admin",
  reasonNote = "Deactivated by admin"
) => {
  try {
    const response = await apiClient.put(
      `/admin/dashboard/partners/${partnerId}/deactivate`,
      { reason, reasonNote }
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

// Update Partner Document Status
export const updatePartnerDocumentStatus = async (partnerId, data) => {

  try {

    const response = await apiClient.put(

      `/admin/dashboard/partners/${partnerId}/documents`,
      {
        partnerId,
        ...data,
      }

    );

    return response.data;

  } 
  catch (error) {
    throw (

      error.response?.data || {
        
        message: "Something went wrong",
      }
    );
  }
};



export const getPendingPartners = async () =>
   {
  try {

    const response = await apiClient.get(

      "/admin/dashboard/all-partners?status=Pending"

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