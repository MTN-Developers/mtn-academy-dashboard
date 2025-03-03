// services/auth.ts
import toast from "react-hot-toast";
// import axios from "../lib/axios";
import { AuthResponse, LoginCredentials } from "../types/auth";
import { AxiosResponse } from "axios";
import axiosInstance from "../lib/axios";

export const authApi = {
  login: async (
    credentials: LoginCredentials
  ): Promise<AxiosResponse<AuthResponse>> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    // console.log("response from auth services ", response);

    return response;
  },

  // logout: async (): Promise<AxiosResponse<void>> => {
  //   return axios.post("/auth/logout");
  // },

  getCurrentUser: async () => {
    const response = await axiosInstance.get<AuthResponse>("/auth/me"); // Make sure this endpoint is correct
    // console.log("Current User Response:", response.data); // Debug log
    return {
      user: response.data.data.user,
      roleWithPermissions: response.data.data.roleWithPermissions,
    };
  },

  refreshToken: async (
    refresh_token: string
  ): Promise<AxiosResponse<AuthResponse>> => {
    try {
      const response = await axiosInstance.post<AuthResponse>("/auth/refresh", {
        refresh_token,
      });

      // console.log("refresh token response from services", response);

      return response;
    } catch (error) {
      toast.error(`error refreshing token from services: ${error}`);
      throw error;
    }
  },
};
