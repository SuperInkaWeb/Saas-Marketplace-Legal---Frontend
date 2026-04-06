"use client";

import { ChatRoom, ChatRoomStatus } from "@/modules/chat/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { UserCircle, Search, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ChatListProps {
  rooms: ChatRoom[];
  selectedRoomId?: string;
  onSelectRoom: (roomId: string) => void;
  loading?: boolean;
}

export function ChatList({ rooms, selectedRoomId, onSelectRoom, loading }: ChatListProps) {
  // Sort rooms: Unread first, then by last message date
  const sortedRooms = [...rooms].sort((a, b) => {
    // Unread count priority
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    
    // Date priority
    const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar conversación..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-800"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-8 text-center space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0" />
                <div className="flex-1 py-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-2 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedRooms.length === 0 ? (
          <div className="p-10 text-center">
            <Clock className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              No tienes chats activos. <br />
              Se habilitarán al iniciar un caso.
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sortedRooms.map((room) => {
              const isSelected = selectedRoomId === room.id;
              const isExpired = room.status === ChatRoomStatus.EXPIRED;
              
              return (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className={cn(
                    "w-full p-3 rounded-2xl flex items-center gap-3 transition-all group relative",
                    isSelected 
                      ? "bg-slate-900 text-white shadow-xl translate-x-1" 
                      : "hover:bg-slate-50 text-slate-600"
                  )}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className={cn(
                      "w-12 h-12 rounded-xl overflow-hidden border-2 transition-transform",
                      isSelected ? "border-white/20" : "border-slate-100"
                    )}>
                      {room.otherParticipantAvatar ? (
                        <Image
                          src={room.otherParticipantAvatar}
                          alt={room.otherParticipantName}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                          <UserCircle className={cn("w-7 h-7", isSelected ? "text-white/40" : "text-slate-400")} />
                        </div>
                      )}
                    </div>
                    {/* Status dot (online simulation or just active indicator) */}
                    {!isExpired && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-500/10 shadow-sm" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className={cn("text-sm font-bold truncate", isSelected ? "text-white" : "text-slate-900")}>
                        {room.otherParticipantName}
                      </h4>
                      {room.lastMessageAt && (
                        <span className={cn("text-[10px] shrink-0", isSelected ? "text-white/40" : "text-slate-400")}>
                          {formatDistanceToNow(new Date(room.lastMessageAt), { addSuffix: false, locale: es })}
                        </span>
                      )}
                    </div>
                    <p className={cn("text-xs truncate", isSelected ? "text-white/60" : "text-slate-500")}>
                      {room.lastMessage || "Sin mensajes aún"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                       <ShieldCheck className={cn("w-3 h-3", isSelected ? "text-white/40" : "text-slate-400")} />
                       <span className={cn("text-[10px] font-bold uppercase tracking-tight truncate", isSelected ? "text-white/40" : "text-slate-500")}>
                         {room.caseTitle}
                       </span>
                    </div>
                  </div>

                  {/* Unread Indicator (Red Dot) */}
                  {room.unreadCount > 0 && !isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] border border-white" />
                    </motion.div>
                  )}
                  
                  {isSelected && (
                    <motion.div
                      layoutId="chatActiveIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-500 rounded-r-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
