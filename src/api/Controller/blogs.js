import apiClient from "../Interceptor/apiClient";

// ================= ADMIN =================

// Create Article
export const createArticle = (formData) => {
  return apiClient.post("/admin/insights/create", formData);
};

// Get All Articles - Admin
export const getAdminArticles = () => {
  return apiClient.get("/admin/insights/admin/all");
};

// Get Article By ID
export const getArticleById = (id) => {
  return apiClient.get(`/admin/insights/admin/${id}`);
};

// Update Article
export const updateArticle = (id, formData) => {
  return apiClient.put(`/admin/insights/update/${id}`, formData);
};

// Delete Article
export const deleteArticle = (id) => {
  return apiClient.delete(`/admin/insights/delete/${id}`);
};

// Get All Newsletter Subscribers
export const getAllSubscribers = () => {
  return apiClient.get("/admin/insights/subscribers");
};


// ================= USER / PUBLIC =================

// Subscribe Newsletter
export const subscribeNewsletter = (email) => {
  return apiClient.post("/admin/insights/subscribe", {
    email,
  });
};

// Get All Published Articles
export const getAllArticles = (params) => {
  return apiClient.get("/admin/insights/all", {
    params,
  });
};

// Get Article Detail By Slug
export const getArticleDetail = (slug) => {
  return apiClient.get(`/admin/insights/detail/${slug}`);
};

// Get Featured Article
export const getFeaturedArticle = () => {
  return apiClient.get("/admin/insights/featured");
};

// Get Related Articles
export const getRelatedArticles = (params) => {
  return apiClient.get("/admin/insights/related", {
    params,
  });
};

// Get Article Categories
export const getArticleCategories = () => {
  return apiClient.get("/admin/insights/categories");
};