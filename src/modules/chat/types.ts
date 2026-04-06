
export enum ChatRoomStatus {
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  EXPIRED = "EXPIRED",
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  caseId: string;
  caseTitle: string;
  otherParticipantName: string;
  otherParticipantAvatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  status: ChatRoomStatus;
  closedAt?: string; // To handle the 1-day expiration rule
}

export interface SendMessageRequest {
  text: string;
}
