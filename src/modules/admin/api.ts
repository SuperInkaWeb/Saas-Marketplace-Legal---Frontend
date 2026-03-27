import api from "@/lib/api";
import {
  AdminDashboardResponse,
  AdminUserListResponse,
  AdminUserDetailResponse,
  AdminLawyerPendingResponse,
  UpdateAccountStatusRequest,
  VerifyLawyerRequest,
  PaginatedResponse,
  SpecialtyResponse,
  CreateSpecialtyRequest,
} from "./types";

const BASE = "/admin";

export const adminApi = {
  // ── Dashboard ────────────────────────────────────────────────────
  getDashboard: async (): Promise<AdminDashboardResponse> => {
    const { data } = await api.get(`${BASE}/dashboard`);
    return data;
  },

  // ── Users ────────────────────────────────────────────────────────
  getUsers: async (params: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<AdminUserListResponse>> => {
    const { data } = await api.get(`${BASE}/users`, { params });
    return data;
  },

  getUserDetail: async (publicId: string): Promise<AdminUserDetailResponse> => {
    const { data } = await api.get(`${BASE}/users/${publicId}`);
    return data;
  },

  updateAccountStatus: async (
    publicId: string,
    body: UpdateAccountStatusRequest
  ): Promise<void> => {
    await api.put(`${BASE}/users/${publicId}/status`, body);
  },

  // ── Lawyer Verification ──────────────────────────────────────────
  getPendingLawyers: async (): Promise<AdminLawyerPendingResponse[]> => {
    const { data } = await api.get(`${BASE}/lawyers/pending`);
    return data;
  },

  verifyLawyer: async (
    userPublicId: string,
    body: VerifyLawyerRequest
  ): Promise<void> => {
    await api.put(`${BASE}/lawyers/${userPublicId}/verify`, body);
  },

  // ── Specialties ──────────────────────────────────────────────────
  getAllSpecialties: async (): Promise<SpecialtyResponse[]> => {
    const { data } = await api.get(`${BASE}/specialties`);
    return data;
  },

  createSpecialty: async (body: CreateSpecialtyRequest): Promise<SpecialtyResponse> => {
    const { data } = await api.post(`${BASE}/specialties`, body);
    return data;
  },

  updateSpecialty: async (
    id: number,
    body: CreateSpecialtyRequest
  ): Promise<SpecialtyResponse> => {
    const { data } = await api.put(`${BASE}/specialties/${id}`, body);
    return data;
  },

  deleteSpecialty: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/specialties/${id}`);
  },

  toggleSpecialtyStatus: async (id: number): Promise<SpecialtyResponse> => {
    const { data } = await api.patch(`${BASE}/specialties/${id}/toggle`);
    return data;
  },
};
