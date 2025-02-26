// hooks/useGetRelatedCourses.ts
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { CourseResponse } from "../types/courses";

async function fetchRelatedCourses(semesterId: string) {
  const response = await axiosInstance.get(`/course/semester/${semesterId}`);
  return response.data as CourseResponse;
}

const useGetRelatedCourses = (semesterId: string) => {
  return useQuery({
    queryKey: ["courses", semesterId],
    queryFn: () => fetchRelatedCourses(semesterId),
    enabled: !!semesterId,
  });
};

export default useGetRelatedCourses;
