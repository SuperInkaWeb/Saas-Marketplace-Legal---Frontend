import api from "@/lib/api";
import { UpdateClientProfileRequest, UpdateLawyerProfileRequest } from "../types";

export const profileService = {
  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.patch("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  updateClientLogo: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.patch("/profile/client/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },


  updateClientProfile: async (payload: UpdateClientProfileRequest) => {
    const { data } = await api.put("/profile/client", payload);
    return data;
  },

  updateLawyerProfile: async (payload: UpdateLawyerProfileRequest) => {
    const { data } = await api.put("/profile/lawyer", payload);
    return data;
  },
};
