import { useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import { useAuthStore } from "@/modules/auth/store";
import { ChatMessage } from "../types";

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

export const useChatSocket = (
  roomId: string | null,
  onMessageReceived: (message: any) => void,
  prefix: string = "/topic/chat/"
) => {
  const stompClient = useRef<Client | null>(null);
  const token = useAuthStore((state) => state.token);

  const connect = useCallback(() => {
    if (!token || !roomId) return;

    const client = new Client({
      brokerURL: WEBSOCKET_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log("Connected to WebSocket: " + frame);
      
      // Subscribe to the specific topic
      client.subscribe(`${prefix}${roomId}`, (message) => {
        if (message.body) {
          try {
            const data = JSON.parse(message.body);
            onMessageReceived(data);
          } catch (e) {
            console.error("Error parsing websocket message body", e);
          }
        }
      });
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    client.activate();
    stompClient.current = client;
  }, [token, roomId, onMessageReceived, prefix]);

  const disconnect = useCallback(() => {
    if (stompClient.current) {
      stompClient.current.deactivate();
      stompClient.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected: stompClient.current?.connected,
  };
};
