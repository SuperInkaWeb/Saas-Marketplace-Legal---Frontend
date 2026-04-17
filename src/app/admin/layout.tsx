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
  ChevronDown,
  UserCircle,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const sections = [
  {
    title: "General",
    items: [
      { label: "Dashboard", href: "/admin", icon: BarChart3 },
    ]
  },
  {
    title: "Gestión",
    items: [
      { label: "Usuarios", href: "/admin/users", icon: Users },
      { label: "Verificaciones", href: "/admin/verifications", icon: ShieldCheck },
    ]
  },
  {
    title: "Contenido",
    items: [
      { label: "Plantillas", href: "/admin/templates", icon: FileText },
      { label: "Especialidades", href: "/admin/specialties", icon: Scale },
      { label: "Moderación", href: "/admin/reviews", icon: MessageSquareWarning },
    ]
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "General": true,
    "Gestión": true,
    "Contenido": true,
  });

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

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
        <img src="/logo full aboghub svg.svg" className="h-12 w-auto animate-pulse brightness-0 invert" alt="AbogHub" />
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

      {/* Admin Profile Card */}
      <div className="px-6 mb-6 shrink-0">
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100/50 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-slate-200 shrink-0 overflow-hidden shadow-inner">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <UserCircle className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-tight">
              {user.firstName} {user.lastNameFather}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600">
                Administrador
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
              className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-all group"
            >
              <span className="group-hover:translate-x-1 transition-transform">{section.title}</span>
              <ChevronDown className={cn(
                "w-3.5 h-3.5 transition-transform duration-500 ease-in-out font-bold",
                expandedSections[section.title] ? "rotate-0 text-emerald-600" : "-rotate-90"
              )} />
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
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block outline-none"
                      >
                        <motion.div
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 group relative rounded-lg",
                            isActive
                              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                              : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-600/5"
                          )}
                        >
                          <Icon className={cn(
                            "w-4 h-4 shrink-0 transition-all duration-200",
                            isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-600"
                          )} />
                          <span className="truncate">{item.label}</span>
                        </motion.div>
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
      <div className="p-4 border-t border-slate-100 mt-auto shrink-0 bg-white space-y-1">
        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Ir al Dashboard</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Finalizar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-['Inter',sans-serif]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 z-50">
        <img src="/logo full aboghub svg.svg" className="h-7 w-auto" alt="AbogHub" />
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-500 hover:text-emerald-600 transition-colors"
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
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="absolute right-4 top-4 z-10">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 transition-colors bg-slate-100 rounded-full"
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
      <main className="flex-1 md:pl-72 flex flex-col">
        {/* Desktop Top Header */}
        <header className="hidden md:flex h-16 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-40 items-center justify-between px-10">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Panel de Administración &bull; {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-slate-900 leading-none uppercase tracking-tight">{user.firstName}</p>
              <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mt-1.5">Administrador</p>
            </div>
            <div className="w-9 h-9 bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm rounded-lg">
              {user.avatarUrl
                ? <img src={user.avatarUrl} className="w-full h-full object-cover" alt="avatar" />
                : <UserCircle className="w-5 h-5 text-slate-400" />
              }
            </div>
          </div>
        </header>

        <div className="flex-1 pt-16 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
