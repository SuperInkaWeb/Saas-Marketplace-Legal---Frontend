"use client";

import { useAuthStore } from "@/modules/auth/store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  CreditCard
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
    { label: "Inicio", href: "/dashboard", icon: Home },
    { 
      label: "Verificación", 
      href: "/dashboard/verification", 
      icon: ShieldCheck,
      badge: !user.isVerified,
    },
    { label: "Configurar Perfil", href: "/dashboard/profile", icon: Settings },
    { label: "Mis Citas", href: "/dashboard/appointments", icon: Calendar },
    { label: "Marketplace", href: "/dashboard/marketplace", icon: Briefcase },
    { label: "Mis Propuestas", href: "/dashboard/proposals", icon: Send },
    { label: "Mis Reseñas", href: "/dashboard/reviews", icon: Star },
    { label: "Pagos e Ingresos", href: "/dashboard/payments", icon: CreditCard },
    { label: "Mis Documentos", href: "/dashboard/documents", icon: FileText },
    { 
      label: "Mi Perfil Público", 
      href: `/lawyer/${user.slug}`, 
      icon: UserCircle,
      show: !!user.slug,
      external: true 
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#faf8ff] text-slate-800 border-r border-slate-100 overflow-hidden">
      
      {/* Brand Header */}
      <div className="p-6 md:px-8 md:pt-8 md:pb-6 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-manrope font-extrabold text-slate-900 tracking-tight leading-none">Legit</h1>
          <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-1">Directorio Legal</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-6 md:px-8 mb-6 shrink-0">
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-slate-200 shadow-inner">
            {user.avatarUrl ? (
              <Image 
                src={user.avatarUrl} 
                alt="Avatar" 
                width={44} 
                height={44} 
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-extrabold text-slate-900 truncate tracking-tight">{user.firstName} {user.lastNameFather}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Abogado
              </span>
              {user.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 md:px-6 space-y-1 overflow-y-auto custom-scrollbar py-2">
        {navItems.filter(i => i.show !== false).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          const NavLink = (
            <div className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all duration-300 group relative",
              isActive 
                ? "bg-white text-slate-900 font-extrabold shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 translate-x-1" 
                : "text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-100/60 border border-transparent"
            )}>
              <Icon className={cn("w-5 h-5 transition-colors shrink-0", isActive ? "text-secondary" : "text-slate-400 group-hover:text-slate-600")} />
              <span className="truncate">{item.label}</span>
              
              {"badge" in item && item.badge && (
                <span className="ml-auto w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)] shrink-0" />
              )}
              
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicatorLawyer"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-r-full shadow-sm"
                />
              )}
            </div>
          );

          if ("external" in item && item.external) {
            return (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="block focus:outline-none focus:ring-2 focus:ring-secondary/20 rounded-xl">
                {NavLink}
              </a>
            );
          }

          return (
            <Link key={item.href} href={item.href} onClick={onItemClick} className="block focus:outline-none focus:ring-2 focus:ring-secondary/20 rounded-xl">
              {NavLink}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 md:p-6 border-t border-slate-200/50 mt-auto shrink-0 bg-[#faf8ff]">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-slate-500 border border-transparent group active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors shrink-0" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
