import axios from "axios";

const BASE_URL = "https://astrologynarhari-1.onrender.com/api";
// const BASE_URL = "https://api.namahastro.com/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Request Interceptor: Har request me access token add karega
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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: 401 aane par auto token refresh karega
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 error aaya aur ye request pehle retry nahi hui hai
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Agar refresh token API khud 401 de rahi hai toh seedha logout
      if (originalRequest.url?.includes("/admin/refresh-token")) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      // Agar pehle se hi refresh API chal rahi hai, to baaki requests ko wait karao
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // Agar refresh token hi nahi hai to logout karo
      if (!refreshToken) {
        isRefreshing = false;
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        // Direct raw axios se call karenge taaki interceptor loop na bane
        const response = await axios.post(`${BASE_URL}/admin/refresh-token`, {
          refreshToken,
        });

        const newToken = response.data.token || response.data.accessToken;

        localStorage.setItem("token", newToken);

        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }

        apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        // Failed request ko naye token ke sath retry karein
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;