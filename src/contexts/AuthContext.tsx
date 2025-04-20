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

        // console.log("response from auth check auth", response.data.data);

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

      if (response.data.data.user.role !== "user") {
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
      } else {
        toast.error("You are not authorized to login to this application");
        setTokens(null);
        setIsAuthenticated(false);
        setPermissions([]);
        setRole(null);
      }

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
