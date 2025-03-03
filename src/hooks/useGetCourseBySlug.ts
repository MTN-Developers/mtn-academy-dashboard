import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { Course } from "../types/courses";

interface CourseResponse {
  data: Course;
  status: number;
  message: string;
}

async function fetchCourseBySlug(courseSlug: string) {
  const response = await axiosInstance.get(`/course/slug/${courseSlug}`);
  //   console.log("Course chapters: ", response.data);

  return response.data as CourseResponse;
}

const useGetCourseBySlug = (courseSlug: string) => {
  return useQuery({
    queryKey: ["course-by-slug", courseSlug],
    queryFn: () => fetchCourseBySlug(courseSlug),
    enabled: !!courseSlug,
  });
};

export default useGetCourseBySlug;
