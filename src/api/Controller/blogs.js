import apiClient from "../Interceptor/apiClient";

export const getBlogs = ()=> {
    return apiClient.get('/blogs');
}