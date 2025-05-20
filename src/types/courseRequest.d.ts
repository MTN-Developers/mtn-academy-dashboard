type CourseRequest = {
  id: string;
  user_id: string;
  course_id: string;
  note: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
    gender: string;
  };
  course: {
    id: string;
    name_en: string;
    name_ar: string;
    logo_en: string;
    logo_ar: string;
    course_type: string;
  };
};
