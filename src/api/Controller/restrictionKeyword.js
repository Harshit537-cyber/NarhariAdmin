import apiClient from "../Interceptor/apiClient";

// ===============================
// CREATE RESTRICTION KEYWORD
// ===============================
export const createRestrictionKeyword = (payload) => {
  return apiClient.post("/admin/restrictKeyword/add-keyword", payload);
};

// ===============================
// GET ALL RESTRICTION KEYWORDS
// ===============================
export const getAllRestrictionKeywords = (params = {}) => {
  return apiClient.get("/admin/restrictKeyword/get-keywords", {
    params,
  });
};

// ===============================
// GET RESTRICTION KEYWORD BY ID
// ===============================
export const getRestrictionKeywordById = (id) => {
  return apiClient.get(`/restriction-keywords/${id}`);
};

// ===============================
// UPDATE RESTRICTION KEYWORD
// ===============================
export const updateRestrictionKeyword = (id, payload) => {
  return apiClient.put(`/admin/restrictKeyword/update-keyword/${id}`, payload);
};

// ===============================
// DELETE RESTRICTION KEYWORD
// ===============================
export const deleteRestrictionKeyword = (id) => {
  return apiClient.delete(`/admin/restrictKeyword/delete-keyword/${id}`);
};