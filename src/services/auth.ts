// services/auth.ts
import axios from "../lib/axios";
import { AuthResponse, LoginCredentials } from "../types/auth";
import { AxiosResponse } from "axios";

export const authApi = {
  login: async (
    credentials: LoginCredentials
  ): Promise<AxiosResponse<AuthResponse>> => {
    return axios.post<AuthResponse>("/auth/login", credentials);
  },

  logout: async (): Promise<AxiosResponse<void>> => {
    return axios.post("/auth/logout");
  },

  getCurrentUser: async () => {
    const response = await axios.get<AuthResponse>("/auth/me"); // Make sure this endpoint is correct
    console.log("Current User Response:", response.data); // Debug log
    return {
      user: response.data.data.user,
      roleWithPermissions: response.data.data.roleWithPermissions,
    };
  },

  refreshToken: async (
    refresh_token: string
  ): Promise<AxiosResponse<AuthResponse>> => {
    return axios.post<AuthResponse>("/auth/refresh", {
      refresh_token,
    });
  },
};
