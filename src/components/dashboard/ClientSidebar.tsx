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
  Scale
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onItemClick?: () => void;
  onLogout: () => void;
}

export function ClientSidebar({ onItemClick, onLogout }: SidebarProps) {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();

  if (!user) return null;

  const navItems = [
    { label: "Inicio", href: "/dashboard", icon: Home },
    { label: "Mis Citas", href: "/dashboard/appointments", icon: Calendar },
    { label: "Mis Casos", href: "/dashboard/my-cases", icon: Briefcase },
    { label: "Mis Documentos", href: "/dashboard/documents", icon: FileText },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      <div className="p-6 flex items-center gap-3">
        <Scale className="w-8 h-8 text-emerald-500" />
        <span className="text-2xl font-bold text-white tracking-tight">Legit</span>
      </div>

      <div className="px-6 mb-8">
        <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 overflow-hidden border-2 border-emerald-500/20">
            {user.avatarUrl ? (
              <Image 
                src={user.avatarUrl} 
                alt="Avatar" 
                width={48} 
                height={48} 
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-emerald-600" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user.firstName} {user.lastNameFather}</p>
            <p className="text-xs text-slate-400 capitalize">Cliente</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors group relative overflow-hidden",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "hover:bg-slate-800 hover:text-white border border-transparent"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-400")} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicatorClient"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-500 rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-red-500/10 hover:text-red-400 text-slate-400 group"
        >
          <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-colors" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
