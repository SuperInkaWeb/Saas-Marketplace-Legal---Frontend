"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/modules/auth/store";

export default function Navbar() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm font-manrope antialiased tracking-tight">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900">
          Legit
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className="text-slate-600 font-medium hover:text-slate-900 transition-colors"
          >
            Inicio
          </Link>
          <Link 
            href="/marketplace" 
            className="text-blue-700 font-bold border-b-2 border-blue-700 pb-1"
          >
            Buscar Abogados
          </Link>
          <Link
            href="/marketplace/cases"
            className="text-slate-600 font-medium hover:text-slate-900 transition-colors"
          >
            Casos Legales
          </Link>
          <a className="text-slate-600 font-medium hover:text-slate-900 transition-colors" href="#">Precios</a>
          <a className="text-slate-600 font-medium hover:text-slate-900 transition-colors" href="#">Nosotros</a>
        </div>
        <div className="flex items-center gap-4">
          {hydrated && token ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-slate-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 font-semibold rounded-lg text-sm px-3 py-2 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden sm:inline-block font-bold">{user?.fullName?.split(" ")[0]}</span>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-black text-slate-900 truncate">{user?.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-bold"
                    >
                      Panel de Control
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-bold"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all px-4 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-primary-container text-on-primary rounded-lg text-sm font-bold shadow-md hover:opacity-90 transition-all"
              >
                Unirse
              </Link>
            </>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-500"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
      <div className="bg-slate-100 h-px w-full"></div>
    </nav>
  );
}
