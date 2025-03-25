interface Profile {
  id: string;
  user_id: string;
  bio: string | null;
  date_of_birth: string | null;
  facebook_url: string | null;
  x_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  avatar: string | null;
  updated_at: string;
  created_at: string;
  deleted_at: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  role_id: string | null;
  last_feedback_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  profile: Profile;
  country: string;
  phone: string;
  project_name: string | null;
  gender: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UserResponseData {
  data: User[];
  meta: Meta;
}

interface UserResponse {
  data: UserResponseData;
  status: number;
  message: string;
}
