import api from "@/lib/api";
import { MatterTaskRequest, MatterTaskResponse } from "../types";

export const matterTaskService = {
  getTasks: async (matterPublicId: string): Promise<MatterTaskResponse[]> => {
    const response = await api.get(`/matters/${matterPublicId}/tasks`);
    return response.data;
  },

  addTask: async (matterPublicId: string, request: MatterTaskRequest): Promise<MatterTaskResponse> => {
    const response = await api.post(`/matters/${matterPublicId}/tasks`, request);
    return response.data;
  },

  toggleTask: async (taskPublicId: string): Promise<MatterTaskResponse> => {
    const response = await api.patch(`/matters/tasks/${taskPublicId}/toggle`);
    return response.data;
  }
};
