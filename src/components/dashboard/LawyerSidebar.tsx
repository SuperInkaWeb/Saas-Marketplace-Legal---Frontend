"use client";

import { useAuthStore } from "@/modules/auth/store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Home, 
  Calendar, 
  Briefcase, 
  FileText, 
  UserCircle, 
  LogOut,
  Scale,
  Settings,
  ShieldCheck,
  Send,
  Star,
  CreditCard,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onItemClick?: () => void;
  onLogout: () => void;
}

export function LawyerSidebar({ onItemClick, onLogout }: SidebarProps) {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();

  if (!user) return null;

  const navItems = [
    { label: "Panel Principal", href: "/dashboard", icon: Home },
    { 
      label: "Mi Verificación", 
      href: "/dashboard/verification", 
      icon: ShieldCheck,
      badge: !user.isVerified,
    },
    { label: "Configurar Perfil", href: "/dashboard/profile", icon: Settings },
    { label: "Mercado de Casos", href: "/dashboard/marketplace", icon: Sparkles },
    { label: "Agenda y Citas", href: "/dashboard/appointments", icon: Calendar },
    { label: "Expedientes ERP", href: "/dashboard/matters", icon: Briefcase },
    { label: "Propuestas", href: "/dashboard/proposals", icon: Send },
    { label: "Reseñas", href: "/dashboard/reviews", icon: Star },
    { label: "Finanzas", href: "/dashboard/payments", icon: CreditCard },
    { label: "Documentos", href: "/dashboard/documents", icon: FileText },
    { label: "Mensajería", href: "/dashboard/chats", icon: MessageSquare },
    { label: "IA Legal", href: "/dashboard/ai-assistant", icon: Scale },
    { label: "Suscripción", href: "/dashboard/subscription", icon: Sparkles },
    { 
      label: "Ver Perfil Público", 
      href: `/lawyer/${user.slug}`, 
      icon: UserCircle,
      show: !!user.slug,
      external: true 
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-50 overflow-hidden shadow-sm">
      
      {/* Brand Header */}
      <div className="p-8 pb-10 flex items-center gap-4 shrink-0">
        <Link 
          href="/" 
          className="font-manrope font-black tracking-tighter text-2xl text-slate-900 uppercase transition-transform active:scale-95"
        >
          AbogHub
        </Link>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-10 shrink-0">
        <div className="flex items-center gap-4 bg-slate-50 p-4 border border-slate-100 shadow-sm">
          <div className="w-12 h-14 bg-slate-200 shrink-0 overflow-hidden shadow-inner">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-2xl">account_circle</span>
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">{user.firstName}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[9px] text-amber-600 font-black uppercase tracking-[0.2em]">
                {user.isVerified ? "Verificado" : "Pendiente"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar py-2">
        {navItems.filter(i => i.show !== false).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          const NavLink = (
            <motion.div 
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-4 px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group relative",
                isActive 
                  ? "bg-slate-900 text-white shadow-xl" 
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-all duration-300", isActive ? "text-amber-500 scale-110" : "text-slate-300 group-hover:text-slate-900 group-hover:scale-110")} />
              <span className="truncate">{item.label}</span>
              
              {"badge" in item && item.badge && !isActive && (
                <span className="ml-auto w-2 h-2 bg-amber-500 rounded-full" />
              )}
              
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicatorLawyer"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          );

          if ("external" in item && item.external) {
            return (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
                {NavLink}
              </a>
            );
          }

          return (
            <Link key={item.href} href={item.href} onClick={onItemClick} className="block focus:outline-none">
              {NavLink}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-slate-50 mt-auto shrink-0 bg-white">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 group"
        >
          <LogOut className="w-4 h-4 transition-colors shrink-0" />
          <span>Finalizar Sesión</span>
        </button>
      </div>
    </div>
  );
}
