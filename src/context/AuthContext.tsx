// // context/AuthContext.tsx
// import React, { createContext, useContext } from "react";
// import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
// import { NavigateFunction } from "react-router-dom";
// import {
//   User,
//   Role,
//   // Permission,
//   LoginCredentials,
//   AuthResponse,
// } from "../types/auth";
// import { authApi } from "../services/auth";
// import toast from "react-hot-toast";
// import { AxiosResponse } from "axios";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApi } from "../services/auth";
import toast from "react-hot-toast";
import { Permission } from "../types/auth";
// import { AuthResponse, LoginCredentials } from "../types/auth";
// import { AxiosResponse } from "axios";

interface AuthContextType {
  tokens: ITokens | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (
    module: string,
    action: "create" | "read" | "update" | "delete"
  ) => boolean;
  permissions: Permission[];
  role: string | null;
}

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: React.ReactNode;
//   navigate: NavigateFunction;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({
//   children,
//   navigate,
// }) => {
//   const queryClient = useQueryClient();

//   const { data: authData, isLoading } = useQuery({
//     queryKey: ["auth"],
//     queryFn: authApi.getCurrentUser,
//     retry: false,
//     enabled: !!localStorage.getItem("accessToken"),
//   });

//   const loginMutation = useMutation<
//     AxiosResponse<AuthResponse>,
//     Error,
//     LoginCredentials
//   >({
//     mutationFn: authApi.login,
//     onSuccess: (response) => {
//       console.log("Login Response:", response.data); // Debug log

//       const { access_token, refresh_token, user, roleWithPermissions } =
//         response.data.data;

//       // Store tokens
//       localStorage.setItem("accessToken", access_token);
//       localStorage.setItem("refreshToken", refresh_token);

//       // Update query cache
//       queryClient.setQueryData(["auth"], { user, roleWithPermissions });

//       // Invalidate and refetch auth query
//       queryClient.invalidateQueries({ queryKey: ["auth"] });

//       toast.success("Login successful!");
//       navigate("/");
//     },
//     onError: (error: any) => {
//       console.error("Login Error:", error); // Debug log
//       toast.error(error.response?.data?.message || "Login failed");
//     },
//   });

//   const logoutMutation = useMutation<AxiosResponse<void>, Error>({
//     mutationFn: authApi.logout,
//     onSuccess: () => {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       queryClient.clear();
//       navigate("/login");
//       toast.success("Logged out successfully");
//     },
//   });

//   const hasPermission = (
//     module: string,
//     action: "create" | "read" | "update" | "delete"
//   ): boolean => {
//     const permission = authData?.roleWithPermissions.permissions.find(
//       (p) => p.module === module
//     );

//     if (!permission) return false;

//     switch (action) {
//       case "create":
//         return permission.can_create;
//       case "read":
//         return permission.can_read;
//       case "update":
//         return permission.can_update;
//       case "delete":
//         return permission.can_delete;
//       default:
//         return false;
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user: authData?.user ?? null,
//         role: authData?.roleWithPermissions ?? null,
//         isLoading,
//         isAuthenticated: !!authData?.user,
//         login: loginMutation.mutateAsync,
//         logout: logoutMutation.mutateAsync,
//         hasPermission,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<ITokens | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const savedRefreshToken = localStorage.getItem("refreshToken");
    if (savedRefreshToken) {
      try {
        const response = await authApi.refreshToken(savedRefreshToken);
        setTokens({
          accessToken: response.data.data.access_token,
          refreshToken: savedRefreshToken,
        });

        console.log("response from auth check auth", response.data.data);

        setIsAuthenticated(true);
        
      } catch (error) {
        // console.log("removed from checkauth", error);

        localStorage.removeItem("refreshToken");
        setTokens(null);
        setIsAuthenticated(false);
        setPermissions([]);
        setRole(null);
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login({ email, password });
      const { access_token, refresh_token } = response.data.data;
      setTokens({
        accessToken: access_token,
        refreshToken: refresh_token,
      });
      setIsAuthenticated(true);
      setPermissions(
        response.data.data.roleWithPermissions.permissions || []
      );
      setRole(response.data.data.roleWithPermissions?.role_name || null);
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("accessToken", access_token);
      setLoading(false);
    } catch (error) {
      toast.error(`error in authenticating context : ${error}`);
      throw error;
    }
  };

  const logout = () => {
    // console.log("removed from logged out in context");
    localStorage.removeItem("refreshToken");
    setTokens(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (module: string) => {
    return permissions.some(
      (permission) =>
        permission.module === module &&
        (permission.can_read ||
          permission.can_create ||
          permission.can_update ||
          permission.can_delete)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        tokens,
        isAuthenticated,
        loading,
        login,
        logout,
        permissions,
        role,
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
