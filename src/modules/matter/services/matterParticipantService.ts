import api from "@/lib/api";
import { MatterParticipantRequest, MatterParticipantResponse } from "../types";

export const matterParticipantService = {
  getParticipants: async (matterPublicId: string): Promise<MatterParticipantResponse[]> => {
    const response = await api.get(`/matters/${matterPublicId}/participants`);
    return response.data;
  },

  addParticipant: async (matterPublicId: string, request: MatterParticipantRequest): Promise<MatterParticipantResponse> => {
    const response = await api.post(`/matters/${matterPublicId}/participants`, request);
    return response.data;
  },

  updateParticipant: async (participantPublicId: string, request: MatterParticipantRequest): Promise<MatterParticipantResponse> => {
    const response = await api.put(`/matters/participants/${participantPublicId}`, request);
    return response.data;
  },

  removeParticipant: async (participantPublicId: string): Promise<void> => {
    await api.delete(`/matters/participants/${participantPublicId}`);
  }
};
