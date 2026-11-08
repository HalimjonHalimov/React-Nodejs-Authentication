import axios from "axios";
import { fetchingAccessToken } from "../services/auth";

let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url.includes("auth/login") &&
      !originalRequest.url.includes("auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await fetchingAccessToken();
        console.log("New Access Token:", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        setAccessToken(newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
