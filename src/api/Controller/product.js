import apiClient from "../Interceptor/apiClient";


// Get Product List
export const getProductList = async () => {
  try {

    const response = await apiClient.get("/admin/product/list");

    return response.data;

  } catch (error) {

    throw (

      error.response?.data || {

        message: "Something went wrong",
      }
    );
  }
};

// Add Product
export const addProduct = async (formData) => {
  try {

    const response = await apiClient.post(

      "/admin/product/add",
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


export const updateProduct=(id,data)=>{
  return apiClient.put(`/admin/product/update/${id}`,data,
  {
        headers: {

          "Content-Type": "multipart/form-data",
        },
      }
  )
}


// Delete Product
export const deleteProduct = async (productId) => {
  try 
  {
    const response = await apiClient.delete(

      `/admin/product/delete/${productId}`

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