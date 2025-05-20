import { Semester } from "./semesters";

// types/courses.ts
export interface Course {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  about_ar: string | null;
  about_en: string | null;
  benefits_ar: string | null;
  benefits_en: string | null;
  course_duration: string | null;
  logo_ar: string;
  logo_en: string;
  banner_ar: string | null;
  banner_en: string | null;
  erp_code: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  semester_id: string;
  index: number;
  promotion_video_url: string | null;
  semester?: Semester;
  is_locked?: boolean;
  is_completed: boolean;
  chapters: Chapter[] | [];
  has_live: boolean;
}

export interface CourseResponse {
  data: Course[];
  status: number;
  message: string;
}

export interface Chapter {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  type: string;
  price: number | null;
  course_id: string;
  index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_locked: boolean;
  videos: Video[] | [];
  course?: Course;
}

export interface Video {
  id: string;
  title_ar: string;
  title_en: string;
  duration: number;
  video_url: string;
  index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  chapter?: Chapter;
  has_task: boolean;
}
