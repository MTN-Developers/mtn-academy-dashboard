// src/utils/authStorage.ts
import { Tokens } from "../types/auth";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function setAuthTokens({ access_token, refresh_token }: Tokens) {
  // Store in cookies with proper settings
  //   Cookies.set(ACCESS_KEY, access_token, {
  //     path: "/",
  //     sameSite: "strict",
  //     secure: import.meta.env.VITE_NODE_ENV === "production",
  //   });

  //   Cookies.set(REFRESH_KEY, refresh_token, {
  //     path: "/",
  //     sameSite: "strict",
  //     secure: import.meta.env.VITE_NODE_ENV === "production",
  //   });

  // Optionally still store in localStorage as backup
  localStorage.setItem(ACCESS_KEY, access_token);
  localStorage.setItem(REFRESH_KEY, refresh_token);
}

export function clearAuthTokens() {
  // Clear from both cookies and localStorage
  //   Cookies.remove(ACCESS_KEY);
  //   Cookies.remove(REFRESH_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function getAuthTokens(): Tokens {
  // Try to get from cookies first, then fall back to localStorage
  return {
    access_token: localStorage.getItem(ACCESS_KEY) || "",
    refresh_token: localStorage.getItem(REFRESH_KEY) || "",
  };
}

export function logout(redirect = "/login") {
  clearAuthTokens();
  window.location.replace(redirect);
}
