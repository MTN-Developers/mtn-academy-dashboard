import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { useCallback } from "react";

interface IProps {
  limit: number;
  page: number;
  search: string;
  status: string;
}

interface requestResponse {
  data: CourseRequest[];
  meta: MetaData;
}

const useGetAllRequests = ({
  limit = 10,
  page = 1,
  search = "",
  status,
}: IProps) => {
  const fetchRequests = useCallback(async () => {
    const response = await axiosInstance.get<{ data: requestResponse }>(
      `/course-request?limit=${limit}&page=${page}&search=${search}${
        status !== "all" ? `&status=${status}` : ""
      }`
    );
    return response.data.data;
  }, [limit, page, search, status]);

  return useQuery({
    queryKey: ["requests", { limit, page, search, status }],
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
