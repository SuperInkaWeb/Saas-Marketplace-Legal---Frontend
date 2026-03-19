import api from "@/lib/api";
import { 
  LawyerProfileConfigResponse,
  SpecialtyResponse,
  UpdateSpecialtiesRequest,
  ScheduleRequest,
  ScheduleResponse
} from "../types";

const BASE_URL = "/lawyer-profile";

export const lawyerConfigService = {
  getMyConfig: async (): Promise<LawyerProfileConfigResponse> => {
    const { data } = await api.get(`${BASE_URL}/config`);
    return data;
  },

  getAllSpecialties: async (): Promise<SpecialtyResponse[]> => {
    const { data } = await api.get(`${BASE_URL}/specialties/all`);
    return data;
  },

  updateSpecialties: async (payload: UpdateSpecialtiesRequest): Promise<void> => {
    await api.put(`${BASE_URL}/specialties`, payload);
  },

  addSchedule: async (payload: ScheduleRequest): Promise<ScheduleResponse> => {
    const { data } = await api.post(`${BASE_URL}/schedules`, payload);
    return data;
  },

  updateSchedule: async (id: number, payload: ScheduleRequest): Promise<ScheduleResponse> => {
    const { data } = await api.put(`${BASE_URL}/schedules/${id}`, payload);
    return data;
  },

  deleteSchedule: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/schedules/${id}`);
  },
};
