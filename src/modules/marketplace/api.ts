import api from "@/lib/api";
import { LawyerSearchResponse, PageResponse, SearchParams, SpecialtyResponse, ReviewDTO, ReviewCreateRequest } from "./types";

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

  createReview: async (request: ReviewCreateRequest) => {
    const { data } = await api.post<ReviewDTO>("/reviews", request);
    return data;
  },

  getLawyerReviews: async (lawyerPublicId: string) => {
    const { data } = await api.get<ReviewDTO[]>(`/reviews/lawyer/${lawyerPublicId}`);
    return data;
  },
};
