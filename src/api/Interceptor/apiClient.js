import axios from "axios";

const apiClient = axios.create({
  // baseURL: "https://astrologynarhari-1.onrender.com/api",
  baseURL: "https://api.namahastro.com/api",
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // localStorage.removeItem("token");
      // localStorage.removeItem("role");

      // Redirect Login Page
      // window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default apiClient;