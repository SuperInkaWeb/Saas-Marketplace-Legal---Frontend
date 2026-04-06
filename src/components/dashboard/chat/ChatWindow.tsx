"use client";

import { useEffect, useRef, useState } from "react";
import { ChatRoom, ChatMessage, ChatRoomStatus } from "@/modules/chat/types";
import { ChatMessageItem } from "./ChatMessage";
import { Send, UserCircle, ShieldCheck, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ChatWindowProps {
  room: ChatRoom;
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}

export function ChatWindow({
  room,
  messages,
  currentUserId,
  onSendMessage,
  isLoading,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isExpired = room.status === ChatRoomStatus.EXPIRED;
  const isFinished = room.status === ChatRoomStatus.FINISHED;

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      {/* Glassmorphism Background Pattern */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="shrink-0 p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-slate-100 shadow-inner">
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
                <UserCircle className="w-7 h-7 text-slate-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              {room.otherParticipantName}
              {!isExpired && <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                {room.caseTitle}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {isExpired ? (
            <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-red-600 uppercase tracking-tight">Hilo Cerrado</span>
            </div>
          ) : isFinished ? (
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-600 uppercase tracking-tight">Finaliza pronto</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-tight">En vivo</span>
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 relative custom-scrollbar scroll-smooth bg-transparent"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {messages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-8"
            >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-slate-100 mb-4 animate-bounce-slow">
                <Send className="w-10 h-10 text-slate-200" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Comienza la conversación</h4>
              <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                Envía un saludo a {room.otherParticipantName} para dar inicio a la asesoría profesional.
              </p>
            </motion.div>
          )}

          {messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              isMe={msg.senderId === currentUserId}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-10 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex items-end gap-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-200/60 focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-400 transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            disabled={isExpired}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isExpired ? "Esta conversación ha finalizado" : "Escribe un mensaje aquí..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-3 resize-none max-h-32 custom-scrollbar text-slate-800 font-medium placeholder:text-slate-400 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isExpired}
            className={cn(
              "p-2.5 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:shadow-none disabled:active:scale-100",
              inputText.trim() && !isExpired
                ? "bg-slate-900 text-white hover:bg-black shadow-slate-200"
                : "bg-slate-200 text-slate-400"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {!isExpired && (
          <div className="flex items-center justify-center gap-4 mt-2">
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">
              Presiona <b>Enter</b> para enviar • <b>Shift + Enter</b> para nueva línea
            </p>
            <div className="flex items-center gap-1 opacity-50">
               <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
               <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest">Secured by Legit</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
