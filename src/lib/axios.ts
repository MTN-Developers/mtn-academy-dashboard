// lib/axios.ts
import axios from "axios";
import { AuthResponse } from "../types/auth";

export const baseURL =
  import.meta.env.VITE_BASE_URL || "https://api.mtnlive.mtninstitute.net/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axiosInstance.post<AuthResponse>(
          "/auth/refresh",
          {
            refresh_token: refreshToken,
          }
        );

        const { access_token } = response.data.data;
        localStorage.setItem("accessToken", access_token);
        // localStorage.setItem("refreshToken", refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        // console.log("removed from axios instance");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
