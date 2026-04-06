"use client";

import { ChatMessage } from "@/modules/chat/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { UserCircle, Check, CheckCheck } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: ChatMessage;
  isMe: boolean;
}

export function ChatMessageItem({ message, isMe }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full mb-4 group",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex max-w-[80%] sm:max-w-[70%] gap-3",
        isMe ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        {!isMe && (
          <div className="shrink-0 mt-auto mb-1">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm transition-transform hover:scale-110">
              {message.senderAvatar ? (
                <Image
                  src={message.senderAvatar}
                  alt={message.senderName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-slate-400" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div className="flex flex-col">
          {!isMe && (
            <span className="text-[11px] font-extrabold text-slate-500 mb-1 ml-1 tracking-tight">
              {message.senderName}
            </span>
          )}
          <div
            className={cn(
              "px-4 py-2.5 rounded-2xl shadow-sm relative transition-all duration-300",
              isMe 
                ? "bg-slate-900 text-white rounded-br-none" 
                : "bg-white text-slate-800 border border-slate-100 rounded-bl-none hover:border-slate-200"
            )}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
              {message.text}
            </p>
            
            <div className={cn(
              "flex items-center gap-1.5 mt-1.5",
              isMe ? "justify-end" : "justify-start"
            )}>
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider",
                isMe ? "text-white/40" : "text-slate-400"
              )}>
                {format(new Date(message.createdAt), "HH:mm", { locale: es })}
              </span>
              {isMe && (
                <div className="flex items-center">
                  {message.isRead ? (
                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Check className="w-3 h-3 text-white/30" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
