import api from "@/lib/api";
import type {
  CreateCaseRequest,
  CaseWithProposalsResponse,
} from "../types";

const BASE_URL = "/cases";

export const clientCaseService = {
  createCase: async (
    request: CreateCaseRequest
  ): Promise<CaseWithProposalsResponse> => {
    const { data } = await api.post<CaseWithProposalsResponse>(
      BASE_URL,
      request
    );
    return data;
  },

  getMyCases: async (): Promise<CaseWithProposalsResponse[]> => {
    const { data } = await api.get<CaseWithProposalsResponse[]>(
      `${BASE_URL}/mine`
    );
    return data;
  },

  acceptProposal: async (
    casePublicId: string,
    proposalId: number
  ): Promise<void> => {
    await api.patch(
      `${BASE_URL}/${casePublicId}/proposals/${proposalId}/accept`
    );
  },

  closeCase: async (casePublicId: string): Promise<void> => {
    await api.patch(`${BASE_URL}/${casePublicId}/close`);
  },
};
