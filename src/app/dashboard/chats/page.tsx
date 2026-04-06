"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { 
  useChatRooms, 
  useChatMessages, 
  useSendMessage, 
  useMarkAsRead 
} from "@/modules/chat/hooks";
import { ChatList } from "@/components/dashboard/chat/ChatList";
import { ChatWindow } from "@/components/dashboard/chat/ChatWindow";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ShieldCheck, Scale, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatsPage() {
  const user = useAuthStore((s) => s.user);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  const { data: rooms = [], isLoading: loadingRooms } = useChatRooms();
  const { data: messages = [], isLoading: loadingMessages } = useChatMessages(selectedRoomId);
  const sendMessageMutation = useSendMessage(selectedRoomId || "");
  const markAsReadMutation = useMarkAsRead(selectedRoomId || "");

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  // Mark as read when selecting a room
  useEffect(() => {
    if (selectedRoomId && selectedRoom?.unreadCount && selectedRoom.unreadCount > 0) {
      markAsReadMutation.mutate();
    }
  }, [selectedRoomId, selectedRoom?.unreadCount]);

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setShowListOnMobile(false);
  };

  const handleSendMessage = (text: string) => {
    if (selectedRoomId) {
      sendMessageMutation.mutate({ text });
    }
  };

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-white overflow-hidden">
      {/* Mobile Header (only if room selected) */}
      {!showListOnMobile && selectedRoomId && (
        <div className="md:hidden h-14 border-b border-slate-100 flex items-center px-4 bg-white/80 backdrop-blur-md sticky top-0 z-[60]">
          <button 
            onClick={() => setShowListOnMobile(true)}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 ring-1 ring-slate-100 shadow-inner">
               {selectedRoom?.otherParticipantAvatar ? (
                 <img src={selectedRoom.otherParticipantAvatar} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                   <Scale className="w-4 h-4 text-slate-300" />
                 </div>
               )}
            </div>
            <span className="text-sm font-bold text-slate-900 truncate max-w-[150px]">
              {selectedRoom?.otherParticipantName}
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar / List */}
        <aside className={cn(
          "w-full md:w-80 lg:w-96 flex-col border-r border-slate-200 transition-all duration-300 shrink-0 bg-white z-[50]",
          !showListOnMobile ? "hidden md:flex" : "flex"
        )}>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Mensajes</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Asesoría Profesional</p>
            </div>
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
              <MessageSquare className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatList 
              rooms={rooms} 
              selectedRoomId={selectedRoomId} 
              onSelectRoom={handleSelectRoom}
              loading={loadingRooms}
            />
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 relative",
          showListOnMobile ? "hidden md:flex" : "flex"
        )}>
          {selectedRoom ? (
            <ChatWindow 
              room={selectedRoom}
              messages={messages}
              currentUserId={user.publicId}
              onSendMessage={handleSendMessage}
              isLoading={loadingMessages}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -z-10" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -z-10" />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md text-center"
              >
                <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-slate-100 mx-auto mb-8 relative">
                   <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                   <MessageSquare className="w-10 h-10 text-slate-900" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">Tu Centro de Comunicación</h1>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                  Conecta directamente con profesionales. Selecciona una conversación de la lista para gestionar tus casos legales con total transparencia.
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-emerald-500" />
                      <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider text-center">Seguro y Privado</span>
                   </div>
                   <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2">
                      <Scale className="w-6 h-6 text-blue-500" />
                      <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider text-center">Marco Legal</span>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
