import api from "@/lib/api";
import { CaseRequestResponse, CreateProposalRequest, LawyerProposalResponse } from "../types";

const BASE_URL = "/marketplace";

export const marketplaceService = {
  getOpenCases: async (): Promise<CaseRequestResponse[]> => {
    const { data } = await api.get(`${BASE_URL}/cases/open`);
    return data;
  },

  getCaseDetail: async (publicId: string): Promise<any> => {
    const { data } = await api.get(`${BASE_URL}/cases/${publicId}`);
    return data;
  },

  submitProposal: async (casePublicId: string, payload: CreateProposalRequest): Promise<LawyerProposalResponse> => {
    const { data } = await api.post(`${BASE_URL}/cases/${casePublicId}/proposals`, payload);
    return data;
  },

  // Nuevos Endpoints Públicos
  searchLawyers: async (params?: any): Promise<any> => {
    const { data } = await api.get(`${BASE_URL}/lawyers`, { params });
    return data;
  },

  getPublicLawyerProfile: async (slug: string): Promise<any> => {
    const { data } = await api.get(`/lawyer-profile/public/${slug}`);
    return data;
  }
};
