import api from "@/lib/api";
import { MatterCreateRequest, MatterResponse } from "../types";

const BASE_URL = "/matters";

export const matterService = {
  getMatters: async (search?: string, status?: string): Promise<MatterResponse[]> => {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append("search", search.trim());
    if (status && status.trim()) params.append("status", status.trim());
    
    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    const { data } = await api.get(url);
    return data;
  },

  getMatterByPublicId: async (publicId: string): Promise<MatterResponse> => {
    const { data } = await api.get(`${BASE_URL}/${publicId}`);
    return data;
  },

  createMatter: async (payload: MatterCreateRequest): Promise<MatterResponse> => {
    const { data } = await api.post(BASE_URL, payload);
    return data;
  },

  updateMatterStatus: async (publicId: string, status: string): Promise<MatterResponse> => {
    const { data } = await api.patch(`${BASE_URL}/${publicId}/status`, { status });
    return data;
  }
};
