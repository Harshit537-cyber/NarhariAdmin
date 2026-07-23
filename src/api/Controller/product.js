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

export const createProductCategory = async (formData) => {

  try {
    const response = await apiClient.post(

      "/admin/product-category",

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