import { useCallback } from "react";
import axiosInstance from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../types/practicalChapter";

interface IProps {
  courseId: string;
}

const useGetPracticalExVideos = ({ courseId }: IProps) => {
  const fetchPracticalExVideos = useCallback(async () => {
    const response = await axiosInstance.get(
      `/chapter/course/${courseId}?chapterType=therapy_gym`
    );

    return response.data as ApiResponse;
  }, []);

  return useQuery({
    queryKey: ["practical-ex-videos", courseId],
    queryFn: fetchPracticalExVideos,
    enabled: !!courseId, // Only run the query if courseId is provided
  });
};

export default useGetPracticalExVideos;
