import { useCallback } from "react";
import axiosInstance from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Video } from "../types/courses";

interface IProps {
  id: string;
}

const useGetVideoById = ({ id }: IProps) => {
  const getVideoById = useCallback(async () => {
    const response = await axiosInstance.get(`/video/${id}`);

    return response.data.data as Video;
  }, []);

  return useQuery({ queryKey: ["video"], queryFn: () => getVideoById() });
};

export default useGetVideoById;
