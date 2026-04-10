import api from "@/lib/api";
import { MatterEventRequest, MatterEventResponse } from "../types";

export const matterEventService = {
  getEvents: async (matterPublicId: string): Promise<MatterEventResponse[]> => {
    const response = await api.get(`/matters/${matterPublicId}/events`);
    return response.data;
  },

  addEvent: async (matterPublicId: string, request: MatterEventRequest): Promise<MatterEventResponse> => {
    const response = await api.post(`/matters/${matterPublicId}/events`, request);
    return response.data;
  }
};
