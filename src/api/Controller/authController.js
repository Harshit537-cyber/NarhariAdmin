import apiClient from "../Interceptor/apiClient";

export const loginAdmin = async (data) => {
  try {
    const response = await apiClient.post("/admin/login", data);

    localStorage.setItem("token", response.data.token);

    localStorage.setItem("admin", JSON.stringify(response.data.admin));

    localStorage.setItem("role", response.data.admin?.role || "");

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


export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard/all-users");

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

// Get Dashboard Stats
export const getDashboardStats = async () => {

  try {

    const response = await apiClient.get("/admin/dashboard/stats");

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


// Get Recent Users
export const getRecentUsers = async () => {

  try {
    const response = await apiClient.get("/admin/dashboard/recent-users");
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


// Delete User
export const deleteUser = async (userId) => {

  try {
    const response = await apiClient.delete(

      `/admin/dashboard/user/${userId}`
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

// export const sendOtp = async (data) => {
//   try {
//     const response = await apiClient.post("/admin/send-otp", data);

//     return response.data;

//   }
//   catch (error) {
//     throw (
//       error.response?.data || {

//         message: "Something went wrong",
//       }
//     );
//   }
// };

// Update User
export const updateUser = async (userId, formData) => {
  try {
    const response = await apiClient.put(
      `/admin/dashboard/users/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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