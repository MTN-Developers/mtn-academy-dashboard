//useGetUserCourses.ts

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { Course } from "../types/courses";

interface UserCourseResponse {
  data: (Course & { is_locked: boolean; is_completed: boolean })[];
  status: number;
  message: string;
}

const fetchUserCourses = async (userId: string | number) => {
  if (!userId) return null;
  const response = await axiosInstance.get<UserCourseResponse>(
    `/course/user/${userId}`
  );
  return response.data;
};

const useGetUserCourses = (userId: string | number) => {
  return useQuery({
    queryKey: ["userCourses", userId],
    queryFn: () => fetchUserCourses(userId),
    enabled: !!userId,
  });
};

export default useGetUserCourses;
