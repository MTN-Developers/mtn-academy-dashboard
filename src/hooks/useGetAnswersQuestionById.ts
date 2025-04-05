import { useCallback } from "react";
import axiosInstance from "../lib/axios";
import { UserAnswer } from "../types/Assigments";
import { useQuery } from "@tanstack/react-query";

interface IProps {
  questionId: string;
  // Add other props as needed
}

const useGetAnswersQuestionById = ({ questionId }: IProps) => {
  const fetchQuestionById = useCallback(async () => {
    const response = await axiosInstance.get(
      `/video-assignment/answer/${questionId}`
    );
    return response.data.data as UserAnswer[];
  }, []);

  return useQuery({
    queryKey: ["question", questionId],
    queryFn: () => fetchQuestionById(),
  });
};

export default useGetAnswersQuestionById;
