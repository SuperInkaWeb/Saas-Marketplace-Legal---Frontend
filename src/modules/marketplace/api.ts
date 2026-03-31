import api from "@/lib/api";
import { LawyerSearchResponse, PageResponse, SearchParams, SpecialtyResponse, ReviewDTO, ReviewCreateRequest, ReviewReportRequest, ReviewReportDTO } from "./types";

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
  
  replyToReview: async (publicId: string, replyText: string) => {
    const { data } = await api.patch<ReviewDTO>(`/reviews/${publicId}/reply`, { replyText });
    return data;
  },

  featureReview: async (publicId: string) => {
    const { data } = await api.patch<ReviewDTO>(`/reviews/${publicId}/feature`);
    return data;
  },

  reportReview: async (publicId: string, request: ReviewReportRequest) => {
    await api.post(`/reviews/${publicId}/report`, request);
  },

  getReviewReports: async () => {
    const { data } = await api.get<ReviewReportDTO[]>("/reviews/admin/reports");
    return data;
  },

  resolveReviewReport: async (publicId: string, deleteReview: boolean) => {
    await api.patch(`/reviews/admin/reports/${publicId}/resolve`, null, {
      params: { deleteReview }
    });
  },
};
