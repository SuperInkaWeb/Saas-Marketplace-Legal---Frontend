"use client";

import { useAuthStore } from "@/modules/auth/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Scale,
  MessageSquareWarning,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Usuarios", href: "/admin/users", icon: Users },
  { label: "Verificaciones", href: "/admin/verifications", icon: ShieldCheck },
  { label: "Plantillas", href: "/admin/templates", icon: FileText },
  { label: "Especialidades", href: "/admin/specialties", icon: Scale },
  { label: "Moderación", href: "/admin/reviews", icon: MessageSquareWarning },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    const safeRole = user.role ? user.role.toUpperCase().trim() : "";
    const isAdmin = safeRole === "ADMIN" || safeRole === "ROLE_ADMIN";
    
    if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, hydrated, router]);

  const rawRole = user?.role ? user.role.toUpperCase().trim() : "";
  const isUserAdmin = rawRole === "ADMIN" || rawRole === "ROLE_ADMIN";

  if (!hydrated || !user || !isUserAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <Scale className="w-12 h-12 text-emerald-500 animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "-0.3s" }} />
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "-0.15s" }} />
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      <div className="p-6 flex items-center gap-3">
        <Scale className="w-8 h-8 text-emerald-500" />
        <div>
          <span className="text-2xl font-bold text-white tracking-tight">Legit</span>
          <span className="ml-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            ADMIN
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
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
                  layoutId="adminSidebarIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-500 rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto space-y-2">
        <Link
          href="/dashboard"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white text-slate-400 group"
        >
          <LayoutDashboard className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          Ir al Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-red-500/10 hover:text-red-400 text-slate-400 group"
        >
          <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-colors" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 text-white">
          <Scale className="w-6 h-6 text-emerald-500" />
          <span className="text-xl font-bold tracking-tight">Legit</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            ADMIN
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-slate-900 z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="absolute right-4 top-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-72 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
