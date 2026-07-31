import apiClient from "../Interceptor/apiClient";

export const getPendingPartners = async () => {
  try {
    const { data } = await apiClient.get("/admin/dashboard/all-partners", {
      params: { status: "Pending" },
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};


export const getPendingKycPartners = async () => {
  try {
    const { data } = await apiClient.get(
      "/admin/dashoard/partners/pending-kyc-partners"
    );
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};


export const updatePartnerStatus = async (partnerId, payload) => {
  try {
    const { data } = await apiClient.put(
      `/admin/dashboard/partners/${partnerId}/profile-approval`,
      payload
    );
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};


export const updatePartnerDocumentStatus = async (partnerId, payload) => {
  try {
    const { data } = await apiClient.put(
      `/admin/dashboard/partners/${partnerId}/documents`,
      payload
    );
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};