export interface VideoQuestion {
  id: string;
  video_id: string;
  question: string;
  updated_at: string; // ISO date string
  created_at: string; // ISO date string
  deleted_at: string | null;
}

interface UserAnswer {
  id: string;
  user_id: string;
  question_id: string;
  answer: string;
  feedback: string | null;
  updated_at: string; // ISO date string
  created_at: string; // ISO date string
  deleted_at: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    gender: "male" | "female" | string; // You can restrict values further if needed
    phone: string;
    avatar: string | null;
  };
}
