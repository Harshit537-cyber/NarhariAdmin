import apiClient from "../Interceptor/apiClient"

export const getAllPartnerBankAccounts = async () => 
    {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.get(
      `/partner/bank-account/admin/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) 
  {
    console.error("Get All Partner Bank Accounts API Error:", error);
    throw error.response?.data || error;
  }
};