// context/AuthContext.tsx
import React, { createContext, useContext } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { NavigateFunction } from "react-router-dom";
import {
  User,
  Role,
  Permission,
  LoginCredentials,
  AuthResponse,
} from "../types/auth";
import { authApi } from "../services/auth";
import toast from "react-hot-toast";
import { AxiosResponse } from "axios";

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    credentials: LoginCredentials
  ) => Promise<AxiosResponse<AuthResponse>>;
  logout: () => Promise<AxiosResponse<void>>;
  hasPermission: (
    module: string,
    action: "create" | "read" | "update" | "delete"
  ) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  navigate: NavigateFunction;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  navigate,
}) => {
  const queryClient = useQueryClient();

  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: authApi.getCurrentUser,
    retry: false,
    enabled: !!localStorage.getItem("accessToken"),
  });

  const loginMutation = useMutation<
    AxiosResponse<AuthResponse>,
    Error,
    LoginCredentials
  >({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      console.log("Login Response:", response.data); // Debug log

      const { access_token, refresh_token, user, roleWithPermissions } =
        response.data.data;

      // Store tokens
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      // Update query cache
      queryClient.setQueryData(["auth"], { user, roleWithPermissions });

      // Invalidate and refetch auth query
      queryClient.invalidateQueries({ queryKey: ["auth"] });

      toast.success("Login successful!");
      navigate("/");
    },
    onError: (error: any) => {
      console.error("Login Error:", error); // Debug log
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const logoutMutation = useMutation<AxiosResponse<void>, Error>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.clear();
      navigate("/login");
      toast.success("Logged out successfully");
    },
  });

  const hasPermission = (
    module: string,
    action: "create" | "read" | "update" | "delete"
  ): boolean => {
    const permission = authData?.roleWithPermissions.permissions.find(
      (p) => p.module === module
    );

    if (!permission) return false;

    switch (action) {
      case "create":
        return permission.can_create;
      case "read":
        return permission.can_read;
      case "update":
        return permission.can_update;
      case "delete":
        return permission.can_delete;
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: authData?.user ?? null,
        role: authData?.roleWithPermissions ?? null,
        isLoading,
        isAuthenticated: !!authData?.user,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
