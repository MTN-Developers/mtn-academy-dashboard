import { useCallback } from "react";
import axiosInstance from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Material } from "../types/materials";

interface IProps {
  courseId: string;
}

const useGetRelatedMaterials = ({ courseId }: IProps) => {
  const fetchRelatedMaterials = useCallback(async () => {
    try {
      const response = await axiosInstance(
        `/course-material/course/${courseId}`
      );
      return response.data.data as Material[];
    } catch (error) {
      console.error("Error fetching related materials: ", error);
    }
  }, []);

  return useQuery({
    queryKey: ["relatedMaterials", courseId],
    queryFn: fetchRelatedMaterials,
    enabled: !!courseId,
  });
};

export default useGetRelatedMaterials;
