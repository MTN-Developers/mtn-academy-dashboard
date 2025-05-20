"use client";
//context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

import api from "../lib/axios";
import { LoginResponse, User } from "../types/auth";
import {
  clearAuthTokens,
  getAuthTokens,
  setAuthTokens,
} from "../utils/authStorage";

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
};

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: "admin" | "staff" | "user";
  role_id: string;
  name?: string;
  exp?: number;
  iat?: number;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // ——— bootstrap from localStorage on first load ———
  useEffect(() => {
    setIsAuthenticated(false);
    const { access_token } = getAuthTokens();

    if (access_token) {
      try {
        const decoded = jwtDecode<JwtPayload>(access_token);

        // console.log("deco", decoded);

        setUser({
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name ?? "",
          role_id: decoded.role_id,
        });
        setIsAuthenticated(true);
      } catch {
        clearAuthTokens();
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  // ——— API call to /auth/login ———
  const login = async (email: string, password: string) => {
    const res = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    const { access_token, refresh_token, user } = res.data.data;
    setAuthTokens({ access_token, refresh_token });
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuthTokens();
    setUser(null);
    setIsAuthenticated(false);
    // optional: redirect
    window.location.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
