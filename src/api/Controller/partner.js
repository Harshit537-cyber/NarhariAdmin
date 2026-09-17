import apiClient from "../Interceptor/apiClient";



export const getAllPartners = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.get(
      `/admin/dashboard/partners-status-list?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Get Partners Status List API Error:", error);
    throw error.response?.data || error;
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
      `/admin/dashboard/partners/${partnerId}`
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

export const getAllPartnersStatus = async () =>
   {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.get(
      `/admin/dashboard/all-partners-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
   catch (error) 
  {
    console.error("Get All Partners Status API Error:", error);
    throw error.response?.data || error;
  }
};


export const togglePartnerStatus = async (id, data) => 
  {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.patch(
      `/admin/dashboard/partners/${id}/toggle-status`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) 
  {
    console.error("Toggle Partner Status API Error:", error);
    
    throw error.response?.data || error;
  }
};