import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const https = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

export const setupInterceptor = () => {
  https.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  https.interceptors.response.use(
    (response) => {
      if (response?.data) {
        return response;
      } else {
        return Promise.reject(new Error("Unexpected response format"));
      }
    },
    (error) => {
      if (!navigator.onLine) {
        return Promise.reject(new Error("No internet connection"));
      }
      return Promise.reject(error.response?.data || error);
    }
  );
};

export default https;
