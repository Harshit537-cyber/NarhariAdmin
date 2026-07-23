import apiClient from "../Interceptor/apiClient";

// Get Product Categories
export const getProductCategories = async () => {

  try {

    const response = await apiClient.get("/admin/product-category");

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