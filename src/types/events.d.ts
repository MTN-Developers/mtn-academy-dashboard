interface Semester {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  image_url_ar: string;
  image_url_en: string;
  promotion_video_url: string;
  price: number;
  price_after_discount: number;
  updated_at: string;
  created_at: string;
  deleted_at: string | null;
}

interface Event {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  start_date: string;
  semester_id: string;
  end_date: string;
  updated_at: string;
  created_at: string;
  deleted_at: string | null;
  semester: Semester;
}

interface MetaData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface EventsData {
  data: Event[];
  meta: MetaData;
}

interface ApiResponse {
  data: EventsData;
  status: number;
  message: string;
}
