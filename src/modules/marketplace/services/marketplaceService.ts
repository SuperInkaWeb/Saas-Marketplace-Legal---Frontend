import api from "@/lib/api";
import { CaseRequestResponse, CreateProposalRequest, LawyerProposalResponse } from "../types";

const BASE_URL = "/marketplace";

export const marketplaceService = {
  getOpenCases: async (): Promise<CaseRequestResponse[]> => {
    const { data } = await api.get(`${BASE_URL}/cases/open`);
    return data;
  },

  submitProposal: async (casePublicId: string, payload: CreateProposalRequest): Promise<LawyerProposalResponse> => {
    const { data } = await api.post(`${BASE_URL}/cases/${casePublicId}/proposals`, payload);
    return data;
  }
};
