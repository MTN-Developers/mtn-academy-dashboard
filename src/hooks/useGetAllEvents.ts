import React from "react";
import axiosInstance from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

interface IProps {
  limit: number;
  page: number;
}

interface EventResponse {
  data: Event[];
  meta: MetaData;
}

const useGetAllEvents = ({ limit = 10, page = 1 }: IProps) => {
  const fetchEvents = React.useCallback(async () => {
    const response = await axiosInstance.get<{ data: EventResponse }>(
      `/events?limit=${limit}&page=${page}`
    );
    return response.data.data;
  }, [limit, page]); // Add dependencies

  return useQuery({
    queryKey: ["events", { limit, page }],
    queryFn: fetchEvents,
  });
};

export default useGetAllEvents;
