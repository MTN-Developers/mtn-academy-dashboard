// types/auth.ts
export interface Permission {
  id: string;
  role_id: string;
  module: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface RefreshTokenResponse {
  data: {
    access_token: string;
  };
  status: number;
  message: string;
}

export interface Role {
  id: string;
  role_name: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  phone: string;
  project_name: string | null;
  role: string;
  role_id: string;
  gender: string;
  is_account_verified: boolean;
}

export interface AuthResponse {
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
    roleWithPermissions: Role;
  };
  status: number;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
