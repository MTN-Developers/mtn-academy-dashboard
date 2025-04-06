import { useCallback } from "react";
import { VideoQuestion } from "../types/Assigments";
import axiosInstance from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

interface IProps {
  videoId: string;
}

const useGetQuestionsByVideoId = ({ videoId }: IProps) => {
  const getQuestionsByVideoId = useCallback(async () => {
    const response = await axiosInstance.get(
      `/video-assignment/question/video/${videoId}`
    );

    return response.data.data as VideoQuestion[];
  }, []);

  return useQuery({
    queryKey: ["video-assignment", videoId],
    queryFn: () => getQuestionsByVideoId(),
    enabled: !!videoId,
  });
};

export default useGetQuestionsByVideoId;
