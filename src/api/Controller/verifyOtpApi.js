import apiClient from "../Interceptor/apiClient";

export const verifyOtp = async (data) => {
  try {
    const response = await apiClient.post("/admin/verify-otp", data);

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    if (response.data?.admin) {
      localStorage.setItem("admin", JSON.stringify(response.data.admin));
      localStorage.setItem("role", response.data.admin?.role || "");
    }

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Something went wrong",
      }
    );
  }
};

export const registerAdmin = async (data) => {
  try {
    const response = await apiClient.post("/admin/register", data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Something went wrong",
      }
    );
  }
};