import apiClient from "./Interceptor/apiClient";

export const loginAdmin = async (data) => {
  try {
    const response = await apiClient.post("/api/admin/login", data);

    if (response.data.success) {
      const { token, role, permissions } = response.data.data;

      // Save in Local Storage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem(
        "permissions",
        JSON.stringify(permissions || [])
      );
    }

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};