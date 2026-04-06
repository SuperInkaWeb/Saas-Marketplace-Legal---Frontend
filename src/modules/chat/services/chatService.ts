import api from "@/lib/api";
import { ChatRoom, ChatMessage, SendMessageRequest } from "../types";

export const chatService = {
  /**
   * Fetch all professional chat rooms for the current user.
   */
  getRooms: async (): Promise<ChatRoom[]> => {
    const { data } = await api.get("/chats");
    return data;
  },

  /**
   * Fetch a specific room's details.
   */
  getRoomById: async (roomId: string): Promise<ChatRoom> => {
    const { data } = await api.get(`/chats/${roomId}`);
    return data;
  },

  /**
   * Fetch messages for a specific chat room.
   */
  getMessages: async (roomId: string): Promise<ChatMessage[]> => {
    const { data } = await api.get(`/chats/${roomId}/messages`);
    return data;
  },

  /**
   * Send a new message to a specific chat room.
   */
  sendMessage: async (roomId: string, request: SendMessageRequest): Promise<ChatMessage> => {
    const { data } = await api.post(`/chats/${roomId}/messages`, request);
    return data;
  },

  /**
   * Mark all messages in a room as read.
   */
  markAsRead: async (roomId: string): Promise<void> => {
    await api.put(`/chats/${roomId}/read`);
  },

  /**
   * Get overall unread message count for notification badges.
   */
  getUnreadCount: async (): Promise<number> => {
    const { data } = await api.get("/chats/unread-count");
    return data.count;
  }
};
