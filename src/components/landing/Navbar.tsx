"use client";

import { useAuthStore } from "@/modules/auth/store";
import { useLogout } from "@/modules/auth/hooks";
import { useEffect, useState } from "react";
import Link from "next/link";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const { logout } = useLogout();
  const hydrated = useAuthStore((s) => s.hydrated);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Soluciones", href: "#" },
    { name: "Actualidad", href: "#" },
    { name: "Nosotros", href: "#" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-outline-variant/10"
    >
      <div className="flex justify-between items-center w-full px-6 lg:px-12 py-5 max-w-[1920px] mx-auto">
        <Link 
          href="/" 
          className="font-manrope font-black tracking-tighter text-2xl text-primary uppercase transition-transform active:scale-95"
        >
          AbogHub
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href} 
                className="relative group py-2"
              >
                <span className={`font-manrope tracking-[0.1em] font-bold uppercase text-[11px] transition-colors duration-300 ${isActive ? "text-primary" : "text-secondary hover:text-primary"}`}>
                  {link.name}
                </span>
                <motion.div 
                  initial={false}
                  animate={{ width: isActive ? "100%" : "0%" }}
                  whileHover={{ width: "100%" }}
                  className="absolute bottom-0 left-0 h-[2px] bg-accent"
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-6">
          {hydrated && token && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mr-2">
              <NotificationCenter />
            </motion.div>
          )}
          
          {hydrated && token ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-4 group"
              >
                <div className="hidden lg:flex flex-col items-end leading-none text-right">
                  <span className="font-manrope text-[10px] font-black tracking-[0.2em] uppercase text-primary">
                    {user?.fullName?.split(" ")[0]}
                  </span>
                  <span className="font-manrope text-[9px] text-accent tracking-[0.2em] uppercase mt-1 font-bold">
                    Portal Activo
                  </span>
                </div>
                <div className="w-10 h-10 bg-primary flex items-center justify-center text-white font-black text-sm border-2 border-transparent group-hover:border-accent transition-all overflow-hidden duration-500">
                   {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsProfileOpen(false)}
                    ></motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 mt-6 w-64 bg-white border border-outline-variant/15 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-20 overflow-hidden"
                    >
                      <div className="px-6 py-6 border-b border-outline-variant/10 bg-surface-container-low/30 text-right">
                        <p className="font-manrope text-[11px] font-black text-primary truncate uppercase tracking-[0.1em]">
                          {user?.fullName}
                        </p>
                        <p className="font-manrope text-[9px] text-secondary truncate tracking-[0.1em] uppercase mt-1">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center justify-end px-6 py-4 font-manrope text-[10px] font-black tracking-widest uppercase text-secondary hover:text-primary hover:bg-surface-container-low/50 transition-all"
                        >
                          Mi Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            logout();
                          }}
                          className="flex items-center justify-end w-full text-right px-6 py-4 font-manrope text-[10px] font-black tracking-widest uppercase text-error hover:bg-error/5 transition-all border-t border-outline-variant/10"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/login"
                className="bg-primary text-white px-10 py-4 font-manrope text-[10px] font-black tracking-[0.2em] uppercase hover:bg-accent transition-all inline-block"
              >
                Acceso Portal
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
