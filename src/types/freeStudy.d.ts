// types/freeStudies.ts

/* ────────────────────────────────────────────────────────── */
/* 1.  Elementary pieces                                     */
/* ────────────────────────────────────────────────────────── */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * One course inside the "free study" list.
 * Properties that can be `null` are typed with `| null`.
 */
export interface FreeStudyCourse {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string | null;
  description_en: string | null;
  about_ar: string | null;
  about_en: string | null;
  benefits_ar: string | null;
  benefits_en: string | null;
  course_duration: string | null;
  logo_ar: string | null;
  logo_en: string | null;
  banner_ar: string | null;
  banner_en: string | null;
  course_type: "free_study";
  price: number | null;
  price_after_discount: number | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  deleted_at: string | null;
  promotion_video_url: string | null;
  erp_code: string | null;
  semester_id: string;
  index: number;
  is_locked: boolean;
  is_completed: boolean;
}

/* ────────────────────────────────────────────────────────── */
/* 2.  Generic envelope used by many endpoints               */
/* ────────────────────────────────────────────────────────── */

export interface ApiEnvelope<T> {
  data: T;
  status: number; // HTTP status echoed by server
  message: string;
}

/* ────────────────────────────────────────────────────────── */
/* 3.  Concrete response shape for /free-studies             */
/* ────────────────────────────────────────────────────────── */

export type FreeStudiesData = {
  data: FreeStudyCourse[];
  meta: PaginationMeta;
};

export type FreeStudiesResponse = ApiEnvelope<FreeStudiesData>;

/* ---------------------------------------------------------- */
/* Example usage                                              */
// const { data } = await axios.get<FreeStudiesResponse>("/free-studies");
// data.data.data // → FreeStudyCourse[]
// data.data.meta // → PaginationMeta
