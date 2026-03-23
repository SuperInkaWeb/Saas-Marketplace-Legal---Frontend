import { useQuery } from "@tanstack/react-query";
import { marketplaceApi } from "./api";
import { PageResponse, LawyerSearchResponse, SearchParams } from "./types";

export function useSearchLawyers(params: SearchParams, options?: any) {
  return useQuery<PageResponse<LawyerSearchResponse>>({
    queryKey: ["marketplace-lawyers", params],
    queryFn: () => marketplaceApi.searchLawyers(params),
    ...options
  });
}

export function useSpecialties() {
  return useQuery({
    queryKey: ["marketplace-specialties"],
    queryFn: () => marketplaceApi.getAllSpecialties(),
  });
}
