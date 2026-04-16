"use client";

import { useAuthStore } from "@/modules/auth/store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    //{ label: "Servicios", href: "/services" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Mercado de Casos", href: "/marketplace/cases" },
    //{ label: "Directorio", href: "/directory" },
    //{ label: "Contacto", href: "/contact" },
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
          className="transition-transform active:scale-95"
        >
          <img src="/logo full aboghub svg.svg" alt="AbogHub" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          
          <div className="h-4 w-px bg-outline-variant/20 mx-2" />

          {user ? (
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all duration-300"
            >
              Panel de Control
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 hover:text-primary px-4"
              >
                Ingreso
              </Link>
              <Link 
                href="/register" 
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all duration-300 pointer-events-auto"
              >
                Inscripción
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-primary p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-outline-variant/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-outline-variant/10" />
              {user ? (
                <Link 
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-primary text-on-primary px-6 py-4 text-center text-xs font-black uppercase tracking-[0.2em]"
                >
                  Panel de Control
                </Link>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-primary text-center text-xs font-black uppercase tracking-[0.2em] py-2"
                  >
                    Ingreso
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-primary text-on-primary px-6 py-4 text-center text-xs font-black uppercase tracking-[0.2em]"
                  >
                    Inscripción
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
