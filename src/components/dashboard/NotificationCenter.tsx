"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check, X } from "lucide-react";
import { notificationService } from "@/modules/notification/services/notificationService";
import { NotificationResponse } from "@/modules/notification/types";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Polling every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (publicId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await notificationService.markAsRead(publicId);
      setNotifications(prev => prev.map(n => n.publicId === publicId ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotificationClick = (n: NotificationResponse) => {
    setIsOpen(false);
    if (n.actionUrl) {
      router.push(n.actionUrl);
    } else if (n.title.toLowerCase().includes("mensaje") || n.message.toLowerCase().includes("mensaje")) {
      router.push("/dashboard/chats");
    }
    
    if (!n.isRead) {
      notificationService.markAsRead(n.publicId).catch(console.error);
      setNotifications(prev => prev.map(item => item.publicId === n.publicId ? { ...item, isRead: true } : item));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 z-[100] overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Notificaciones</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Marcar todas leídas
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                  <Bell className="w-8 h-8 text-slate-200 mb-2" />
                  <p className="text-sm">No tienes notificaciones.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100/60">
                  {notifications.map((n) => (
                    <div
                      key={n.publicId}
                      onClick={() => handleNotificationClick(n)}
                      className={cn(
                        "p-4 transition-colors relative group cursor-pointer",
                        !n.isRead ? "bg-blue-50/40" : "hover:bg-slate-50/50"
                      )}
                    >
                      <div className="flex gap-3">
                        {!n.isRead && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-sm" />
                        )}
                        <div className={cn("flex-1", n.isRead ? "pl-5" : "")}>
                          <p className="text-sm font-semibold text-slate-900 mb-0.5 pr-6">{n.title}</p>
                          <p className="text-sm text-slate-600 leading-snug">{n.message}</p>
                          <span className="text-xs text-slate-400 mt-2 block font-medium">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: es })}
                          </span>
                        </div>
                      </div>
                      
                      {!n.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(n.publicId, e)}
                          className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          title="Marcar leída"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
