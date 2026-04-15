"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="flex flex-col md:flex-row justify-between items-start w-full px-6 lg:px-12 py-20 gap-12 max-w-[1920px] mx-auto border-t border-accent/20">
        <div className="flex flex-col gap-8 max-w-sm">
          <div className="mb-2">
            <img src="/logo full aboghub svg.svg" alt="AbogHub" className="h-12 w-auto brightness-0 invert" />
          </div>
          <p className="font-inter text-sm text-slate-300/80 leading-relaxed mt-4">
            © 2026 QORIBEX | TODOS LOS DERECHOS RESERVADOS
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24 w-full md:w-auto">
          <div className="flex flex-col gap-4">
            <span className="text-sm font-bold text-white tracking-wider mb-4 uppercase">Plataforma</span>
            <Link 
              href="/terms" 
              className="font-inter text-sm text-slate-300 hover:text-white transition-colors"
            >
              Términos de Servicio
            </Link>
            <Link 
              href="/privacy" 
              className="font-inter text-sm text-slate-300 hover:text-white transition-colors"
            >
              Privacidad
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-sm font-bold text-white tracking-wider mb-4 uppercase">Gobernanza</span>
            <Link 
              href="/regulatory" 
              className="font-inter text-sm text-slate-300 hover:text-white transition-colors"
            >
              Revelación Regulatoria
            </Link>
            <Link 
              href="/accessibility" 
              className="font-inter text-sm text-slate-300 hover:text-white transition-colors"
            >
              Accesibilidad
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-sm font-bold text-white tracking-wider mb-4 uppercase">Contacto</span>
            <Link 
              href="/contact" 
              className="font-inter text-sm text-slate-300 hover:text-white transition-colors"
            >
              Soporte
            </Link>
            <Link 
              href="/careers" 
              className="font-inter text-sm text-slate-300 hover:text-white transition-colors"
            >
              Carreras
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
