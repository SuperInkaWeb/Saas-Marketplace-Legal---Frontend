import api from "@/lib/api";
import { NotificationResponse } from "../types";

export const notificationService = {
  getMyNotifications: async (): Promise<NotificationResponse[]> => {
    const { data } = await api.get("/notifications");
    return data;
  },

  markAsRead: async (publicId: string): Promise<void> => {
    await api.put(`/notifications/${publicId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put("/notifications/read-all");
  }
};
