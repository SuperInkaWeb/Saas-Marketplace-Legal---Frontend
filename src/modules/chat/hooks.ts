import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "./services/chatService";
import { ChatMessage, ChatRoom, SendMessageRequest } from "./types";
import { useChatSocket } from "./hooks/useChatSocket";
import { useAuthStore } from "../auth/store";
import { useEffect } from "react";

/**
 * Hook to manage chat room list.
 */
export const useChatRooms = () => {
  return useQuery({
    queryKey: ["chat", "rooms"],
    queryFn: chatService.getRooms,
    refetchInterval: 10000, // Refresh every 10s for unread counts
  });
};

/**
 * Hook to manage messages for a specific room.
 */
export const useChatMessages = (roomId?: string) => {
  const queryClient = useQueryClient();

  // Socket for real-time messages
  useChatSocket(roomId || null, (newMessage) => {
    queryClient.setQueryData<ChatMessage[]>(["chat", "messages", roomId], (old) => {
      if (!old) return [newMessage];
      // Avoid duplicates
      if (old.some((m) => m.id === newMessage.id)) return old;
      return [...old, newMessage];
    });

    // Also update the room list's "last message"
    queryClient.invalidateQueries({ queryKey: ["chat", "rooms"] });
  });

  return useQuery({
    queryKey: ["chat", "messages", roomId],
    queryFn: () => chatService.getMessages(roomId!),
    enabled: !!roomId,
    staleTime: Infinity, // No need for automatic refetching with WebSockets
  });
};

/**
 * Hook to send messages.
 */
export const useSendMessage = (roomId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SendMessageRequest) =>
      chatService.sendMessage(roomId, request),
    onSuccess: () => {
      // Refresh current messages
      queryClient.invalidateQueries({ queryKey: ["chat", "messages", roomId] });
      // Also refresh the room list to update last message
      queryClient.invalidateQueries({ queryKey: ["chat", "rooms"] });
    },
  });
};

/**
 * Hook to mark unread messages as read.
 */
export const useMarkAsRead = (roomId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => chatService.markAsRead(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "rooms"] });
    },
  });
};

/**
 * Hook for notification badge (bell).
 */
export const useUnreadChatCount = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  // Global socket hook for unread count
  useChatSocket(user?.publicId || null, () => {
    queryClient.invalidateQueries({ queryKey: ["chat", "unread-count"] });
    queryClient.invalidateQueries({ queryKey: ["chat", "rooms"] });
  }, "/topic/unread-count/");

  return useQuery({
    queryKey: ["chat", "unread-count"],
    queryFn: chatService.getUnreadCount,
    staleTime: 60000,
  });
};
