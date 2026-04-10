import api from "@/lib/api";
import { MatterCreateRequest, MatterResponse } from "../types";

const BASE_URL = "/matters";

export const matterService = {
  getMatters: async (): Promise<MatterResponse[]> => {
    const { data } = await api.get(BASE_URL);
    return data;
  },

  getMatterByPublicId: async (publicId: string): Promise<MatterResponse> => {
    const { data } = await api.get(`${BASE_URL}/${publicId}`);
    return data;
  },

  createMatter: async (payload: MatterCreateRequest): Promise<MatterResponse> => {
    const { data } = await api.post(BASE_URL, payload);
    return data;
  }
};
