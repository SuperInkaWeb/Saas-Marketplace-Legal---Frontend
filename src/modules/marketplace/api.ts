import api from "@/lib/api";
import { LawyerSearchResponse, PageResponse, SearchParams, SpecialtyResponse } from "./types";

export const marketplaceApi = {
  searchLawyers: async (params: SearchParams) => {
    const { data } = await api.get<PageResponse<LawyerSearchResponse>>("/marketplace/lawyers", {
      params,
    });
    return data;
  },

  getAllSpecialties: async () => {
    const { data } = await api.get<SpecialtyResponse[]>("/marketplace/specialties");
    return data;
  },
};
