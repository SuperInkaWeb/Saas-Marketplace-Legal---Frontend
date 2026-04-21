"use client";

import { useAuthStore } from "@/modules/auth/store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
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
  ChevronDown,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onItemClick?: () => void;
  onLogout: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  show?: boolean;
  external?: boolean;
  badge?: boolean;
  isPremium?: boolean;
}

export function LawyerSidebar({ onItemClick, onLogout }: SidebarProps) {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Resumen": true,
    "Gestión Legal": false,
    "Comunicación": false,
    "Crecimiento": false,
    "Configuración": false,
  });

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  if (!user) return null;

  const sections: { title: string; items: NavItem[] }[] = [
    {
      title: "Resumen",
      items: [
        { label: "Panel Principal", href: "/dashboard", icon: Home },
        { label: "Mercado de Casos", href: "/dashboard/marketplace", icon: Sparkles },
      ]
    },
    {
      title: "Gestión Legal",
      items: [
        { label: "Agenda y Citas", href: "/dashboard/appointments", icon: Calendar },
        { label: "Expedientes ERP", href: "/dashboard/matters", icon: Briefcase, isPremium: true },
        { label: "Documentos", href: "/dashboard/documents", icon: FileText },
      ]
    },
    {
      title: "Comunicación",
      items: [
        { label: "Mensajería", href: "/dashboard/chats", icon: MessageSquare },
        { label: "IA Legal", href: "/dashboard/ai-assistant", icon: Scale, isPremium: true },
      ]
    },
    {
      title: "Crecimiento",
      items: [
        { label: "Propuestas", href: "/dashboard/proposals", icon: Send },
        { label: "Reseñas", href: "/dashboard/reviews", icon: Star },
        { 
          label: "Perfil Público", 
          href: `/lawyer/${user.slug}`, 
          icon: UserCircle,
          show: !!user.slug,
          external: true 
        },
      ]
    },
    {
      title: "Configuración",
      items: [
        { label: "Configurar Perfil", href: "/dashboard/profile", icon: Settings },
        { 
          label: "Mi Verificación", 
          href: "/dashboard/verification", 
          icon: ShieldCheck,
          badge: !user.isVerified,
        },
        { label: "Finanzas", href: "/dashboard/payments", icon: CreditCard },
        { label: "Suscripción", href: "/dashboard/subscription", icon: Sparkles },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-100 overflow-hidden shadow-sm">
      
      {/* Brand Header */}
      <div className="p-8 pb-6 flex items-center justify-center shrink-0">
        <Link href="/" className="transition-transform active:scale-95 block">
          <img 
            src="/logo full aboghub svg.svg" 
            alt="AbogHub" 
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-6 shrink-0">
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100/50 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-slate-200 shrink-0 overflow-hidden shadow-inner">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <UserCircle className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-tight">{user.fullName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <div className={cn("w-1.5 h-1.5 rounded-full", user.isVerified ? "bg-brand-secondary" : "bg-amber-500")} />
              <span className={cn("text-[9px] font-bold uppercase tracking-wider", user.isVerified ? "text-brand-secondary" : "text-amber-600")}>
                {user.isVerified ? "Verificado" : "Pendiente"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-4 overflow-y-auto custom-scrollbar py-2">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <button 
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-brand-primary hover:bg-slate-50 rounded-lg transition-all group"
            >
              <span className="group-hover:translate-x-1 transition-transform">{section.title}</span>
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-500 ease-in-out", expandedSections[section.title] ? "rotate-0 text-brand-primary" : "-rotate-90")} />
            </button>
            
            <AnimatePresence initial={false}>
              {expandedSections[section.title] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden space-y-0.5"
                >
                  {section.items.filter(i => i.show !== false).map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    const NavItemComponent = (
                      <motion.div 
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 group relative rounded-lg border border-transparent",
                          isActive 
                            ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                            : "text-slate-500 hover:text-brand-primary hover:bg-brand-primary/5",
                          item.isPremium && !isActive && "border-amber-400/40 bg-amber-50/20 shadow-sm shadow-amber-100"
                        )}
                      >
                        <Icon className={cn("w-4 h-4 shrink-0 transition-all duration-200", 
                          isActive ? "text-white" : "text-slate-400 group-hover:text-brand-primary",
                          item.isPremium && !isActive && "text-amber-600"
                        )} />
                        <span className={cn("truncate", item.isPremium && !isActive && "text-amber-800")}>{item.label}</span>
                        
                        {item.isPremium && (
                          <Lock className="w-3 h-3 ml-auto text-amber-500/60 group-hover:text-amber-500 transition-colors" />
                        )}

                        {"badge" in item && item.badge && !isActive && !item.isPremium && (
                          <span className="ml-auto w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        )}
                      </motion.div>
                    );

                    if ("external" in item && item.external) {
                      return (
                        <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="block outline-none">
                          {NavItemComponent}
                        </a>
                      );
                    }

                    return (
                      <Link key={item.href} href={item.href} onClick={onItemClick} className="block outline-none">
                        {NavItemComponent}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100 mt-auto shrink-0 bg-white">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 group"
        >
          <LogOut className="w-4 h-4 transition-colors shrink-0" />
          <span>Finalizar Sesión</span>
        </button>
      </div>
    </div>
  );
}
