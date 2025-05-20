// src/types/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "user";
  role_id: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

// Add this new interface for the refresh token response
export interface RefreshTokenResponse {
  data: {
    access_token: string;
  };
  status: number;
  message: string;
}

export interface LoginResponse {
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
  status: number; // 201
  message: string; // "Success"
}
