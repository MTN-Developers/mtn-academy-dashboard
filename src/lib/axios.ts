// src/lib/axios.ts
import axios, { AxiosError } from "axios";
// import jwtDecode from "jwt-decode";
import { RefreshTokenResponse } from "../types/auth";
import { getAuthTokens, logout, setAuthTokens } from "../utils/authStorage";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // e.g. "https://api.example.com"
});

// ––– inject the current access token –––
api.interceptors.request.use((config) => {
  const { access_token } = getAuthTokens();
  if (access_token) config.headers.Authorization = `Bearer ${access_token}`;
  return config;
});

// ––– in-flight refresh mutex –––
let refreshing = false;
let queued: ((token: string | null) => void)[] = [];

// helper → call /auth/refresh once and replay queued requests
async function obtainNewAccessToken(refresh_token: string) {
  try {
    const res = await axios.post<RefreshTokenResponse>(
      `/auth/refresh`,
      { refresh_token },
      { baseURL: api.defaults.baseURL }
    );

    // Update your tokens, preserving the existing refresh_token
    // since it's not returned in the response
    const tokens = getAuthTokens();
    setAuthTokens({
      access_token: res.data.data.access_token,
      refresh_token: tokens.refresh_token,
    });

    // alert(`refreshed , ${res.data}`);

    queued.forEach((cb) => cb(res.data.data.access_token));
    queued = [];
    return res.data.data.access_token;
  } catch (err) {
    queued.forEach((cb) => cb(null));
    queued = [];
    throw err;
  } finally {
    refreshing = false;
  }
}

// ––– response interceptor –––
api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config!;
    const { refresh_token } = getAuthTokens();

    // API decided our access token is invalid/expired
    if (
      error.response?.status === 401 &&
      !original._retry // <-- mark so we don't loop forever
    ) {
      original._retry = true;

      if (!refreshing) {
        refreshing = true;
        obtainNewAccessToken(refresh_token).catch(() => logout());
      }

      // pause until we have a new token (or logout)
      return new Promise((resolve, reject) => {
        queued.push((token) => {
          if (!token) return reject(error);
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    throw error;
  }
);

export default api;
