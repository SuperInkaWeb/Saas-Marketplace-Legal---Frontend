"use client";

import { useAuthStore } from "@/modules/auth/store";
import { useMe, useLogout } from "@/modules/auth/hooks";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { 
  Menu, 
  X,
  Scale,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { ClientSidebar } from "@/components/dashboard/ClientSidebar";
import { LawyerSidebar } from "@/components/dashboard/LawyerSidebar";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const { logout } = useLogout();
  const updateUser = useAuthStore((s) => s.updateUser);
  const router = useRouter();
  const pathname = usePathname();

  // Refresh user profile from server on load
  const { data: freshUser } = useMe();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (freshUser) {
      updateUser(freshUser);
    }
  }, [freshUser, updateUser]);

  useEffect(() => {
    if (!hydrated) return; // Wait for rehydration

    if (!user) {
      router.replace("/login");
      return;
    }

    const role = user.role?.toUpperCase()?.trim();
    const isAdmin = role === "ADMIN";

    if (isAdmin) {
      router.replace("/admin");
      return;
    }
    
    if (user.onboardingStep !== "COMPLETED") {
      router.replace("/onboarding/rol");
    }
  }, [user, router, hydrated]);

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <img src="/logo full aboghub svg.svg" className="h-12 w-auto animate-pulse brightness-0 invert" alt="Loading" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "-0.3s" }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "-0.15s" }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  const role = user.role?.toUpperCase()?.trim();
  const isLawyer = role === "LAWYER";

  const SidebarContent = () => (
    <>
      {isLawyer ? (
        <LawyerSidebar 
          onLogout={logout} 
          onItemClick={() => setIsMobileMenuOpen(false)} 
        />
      ) : (
        <ClientSidebar 
          onLogout={logout} 
          onItemClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-['Inter',sans-serif]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo full aboghub svg.svg" className="h-7 w-auto" alt="AbogHub" />
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
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
      <main className="flex-1 md:pl-72 flex flex-col">
        {/* Desktop Top Header (Hidden on mobile) */}
        <header className="hidden md:flex h-16 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-40 items-center justify-end px-10 gap-6">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mr-auto">
            {isLawyer ? "Práctica Legal" : "Panel Cliente"} &bull; {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <NotificationCenter />
          <div className="w-px h-6 bg-slate-100 mx-2" />
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs font-black text-slate-900 leading-none uppercase tracking-tight">{user.firstName}</p>
                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mt-1.5">{isLawyer ? "Verificado" : "Cliente"}</p>
             </div>
             <div className="w-9 h-9 bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
                {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : <Scale className="w-4 h-4 text-slate-300" />}
             </div>
          </div>
        </header>

        <div className="flex-1 pt-16 md:pt-0 bg-surface">
          {children}
        </div>
      </main>
    </div>
  );
}
