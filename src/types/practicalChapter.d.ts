export interface ApiResponse {
  data: Chapter[];
  status: number;
  message: string;
}

export interface Chapter {
  id: string;
  title_ar: string;
  title_en: string;
  course_id: string;
  price: number | null;
  type: string;
  index: number;
  updated_at: string;
  created_at: string;
  deleted_at: string | null;
  videos: Video[];
}

export interface Video {
  id: string;
  title_ar: string;
  title_en: string;
  video_url: string;
  duration: number;
  chapter_id: string;
  index: number;
  updated_at: string;
  created_at: string;
  deleted_at: string | null;
  has_task: boolean;
  description_ar: string;
  description_en: string;
}
