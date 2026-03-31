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

    const role = user.role?.toUpperCase().trim();
    const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

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
        <Scale className="w-12 h-12 text-emerald-500 animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "-0.3s" }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "-0.15s" }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  const role = user.role?.toUpperCase().trim();
  const isLawyer = role === "LAWYER" || role === "ROLE_LAWYER";

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
