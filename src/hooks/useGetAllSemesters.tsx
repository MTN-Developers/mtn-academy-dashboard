import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { Semester } from "../types/semesters";

async function fetchSemesters() {
  const response = await axiosInstance.get("/semesters");
  return response.data.data.data as Semester[];
}

const useGetAllSemesters = () => {
  return useQuery({
    queryKey: ["semesters"],
    queryFn: () => fetchSemesters(),
  });
};

export default useGetAllSemesters;
