import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { useCallback } from "react";

interface IProps {
  limit: number;
  page: number;
  search: string;
}

interface requestResponse {
  data: CourseRequest[];
  meta: MetaData;
}

const useGetAllRequests = ({ limit = 10, page = 1, search = "" }: IProps) => {
  const fetchRequests = useCallback(async () => {
    const response = await axiosInstance.get<{ data: requestResponse }>(
      `/course-request?limit=${limit}&page=${page}&search=${search}`
    );
    return response.data.data;
  }, [limit, page]);

  return useQuery({
    queryKey: ["requests", { limit, page }],
    queryFn: fetchRequests,
  });
};

export default useGetAllRequests;

//update user note
export const updateCourseRequest = async (
  id: string,
  data: { note: string; status: string }
) => {
  return axiosInstance.patch(`/course-request/${id}`, data);
};
