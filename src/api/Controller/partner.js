import apiClient from "../Interceptor/apiClient";

// 1. Get All Partners
export const getAllPartners = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard/all-partners");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// 2. Get Pending Partners
export const getPendingPartners = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard/all-partners", {
      params: { status: "Pending" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// 3. Get Approved Partners (NEW FUNCTION ADDED 🚀)
export const getApprovedPartners = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard/all-partners", {
      params: { status: "Approved" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const updatePartner = async (partnerId, data) => {
  try {
    const response = await apiClient.put(
      `/admin/dashboard/partners/${partnerId}`,
      data
      // 👈 headers config hata diya
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// 5. Delete Partner
export const deletePartner = async (partnerId) => {
  try {
    const response = await apiClient.delete(
      `/admin/dashboard/partner/${partnerId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// 6. Activate Partner
export const activatePartner = async (partnerId) => {
  try {
    const response = await apiClient.put(
      `/admin/dashboard/partners/${partnerId}/activate`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// 7. Deactivate Partner
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
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// 8. Update Document Status (Approve / Reject Document)
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
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};