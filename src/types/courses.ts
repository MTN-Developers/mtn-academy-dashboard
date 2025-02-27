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
}

export interface CourseResponse {
  data: Course[];
  status: number;
  message: string;
}
