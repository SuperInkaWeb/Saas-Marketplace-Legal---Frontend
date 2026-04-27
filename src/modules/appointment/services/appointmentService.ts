import api from "@/lib/api";
import { AppointmentRequest, AppointmentResponse } from "../types";

const BASE_URL = "/appointments";

export const appointmentService = {
  createAppointment: async (payload: AppointmentRequest): Promise<AppointmentResponse> => {
    const { data } = await api.post(BASE_URL, payload);
    return data;
  },

  getLawyerAppointments: async (): Promise<AppointmentResponse[]> => {
    const { data } = await api.get(`${BASE_URL}/lawyer`);
    return data;
  },

  getClientAppointments: async (): Promise<AppointmentResponse[]> => {
    const { data } = await api.get(`${BASE_URL}/client`);
    return data;
  },

  updateStatus: async (appointmentId: string, status: string): Promise<AppointmentResponse> => {
    const { data } = await api.patch(`${BASE_URL}/${appointmentId}/status?status=${status}`);
    return data;
  },
  
  getBusySlots: async (lawyerPublicId: string): Promise<{start: string, end: string}[]> => {
    const { data } = await api.get(`${BASE_URL}/lawyer/${lawyerPublicId}/busy`);
    return data;
  }
};
