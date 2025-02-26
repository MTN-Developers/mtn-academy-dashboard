export interface Semester {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  image_url_ar: string;
  image_url_en: string;
  created_at: string; // or Date if you prefer to parse/store actual dates
  updated_at: string; // or Date if you prefer to parse/store actual dates
  courses: any[]; // replace `any` with a more specific type if known
  promotion_video_url: string;
  price: number;
  slug: string;
  deleted_at: string | null; // or Date | null if you prefer to parse/store actual dates
}
