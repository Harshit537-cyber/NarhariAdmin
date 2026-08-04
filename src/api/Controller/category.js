import apiClient from "../Interceptor/apiClient";

export const updateProductCategory = async (categoryId, formData) => {
  try {

    const response = await apiClient.put(

      `/admin/product-category/${categoryId}`,

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

export const deleteProductCategory = async (categoryId) => {
  try {
    const response = await apiClient.delete(
      `/admin/product-category/${categoryId}`
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