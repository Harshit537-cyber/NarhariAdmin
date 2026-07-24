import apiClient from "../Interceptor/apiClient";

// Get All Banners
export const getAllBanners = async () => {
  const { data } = await apiClient.get("/admin/banner");
  return data;
};

// Add Banner
export const addBanner = async (payload) => {
  const { data } = await apiClient.post("/admin/banner", payload);
  return data;
};

// Update Banner (Multipart Form-Data)
export const updateBanner = async (id, payload) => {
  const { data } = await apiClient.put(`/admin/banner/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Delete Banner
export const deleteBanner = async (id) => {
  const { data } = await apiClient.delete(`/admin/banner/${id}`);
  return data;
};

// Toggle Banner Status
export const toggleBannerStatus = async (id) => {
  const { data } = await apiClient.patch(`/admin/banner/${id}/status`);
  return data;
};