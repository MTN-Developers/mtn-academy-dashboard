"use client";

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { FreeStudiesResponse } from "../../types/freeStudy";

type Props = {
  slug?: string;
  limit?: number;
  page?: number;
};

const useGetAllFreeStudies = ({ slug, limit = 2, page = 1 }: Props) => {
  const fetchAllFreeStudies = useCallback(async () => {
    const baseUrl = "/free-study";
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
    });

    const response = await axiosInstance.get(
      `${baseUrl}${slug ? `/slug/${slug}` : `?${params.toString()}`}`
    );
    return response.data as FreeStudiesResponse;
  }, [slug, limit, page]);

  return useQuery({
    queryKey: ["free-studies", slug, limit, page],
    queryFn: fetchAllFreeStudies,
  });
};

export default useGetAllFreeStudies;
