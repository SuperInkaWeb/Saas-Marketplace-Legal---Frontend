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
          <p className="font-inter text-[10px] tracking-[0.2em] uppercase leading-loose text-secondary/60">
            © {new Date().getFullYear()} ABOGHUB. TODOS LOS DERECHOS RESERVADOS. PRECISIÓN SOBERANA EN TECNOLOGÍA LEGAL.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24 w-full md:w-auto">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold text-white tracking-[0.3em] mb-4 uppercase">Plataforma</span>
            <Link 
              href="/terms" 
              className="font-inter text-[10px] tracking-widest uppercase text-secondary/70 hover:text-white underline underline-offset-8 transition-all"
            >
              Términos de Servicio
            </Link>
            <Link 
              href="/privacy" 
              className="font-inter text-[10px] tracking-widest uppercase text-secondary/70 hover:text-white underline underline-offset-8 transition-all"
            >
              Privacidad
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold text-white tracking-[0.3em] mb-4 uppercase">Gobernanza</span>
            <Link 
              href="/regulatory" 
              className="font-inter text-[10px] tracking-widest uppercase text-secondary/70 hover:text-white underline underline-offset-8 transition-all"
            >
              Revelación Regulatoria
            </Link>
            <Link 
              href="/accessibility" 
              className="font-inter text-[10px] tracking-widest uppercase text-secondary/70 hover:text-white underline underline-offset-8 transition-all"
            >
              Accesibilidad
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold text-white tracking-[0.3em] mb-4 uppercase">Contacto</span>
            <Link 
              href="/contact" 
              className="font-inter text-[10px] tracking-widest uppercase text-secondary/70 hover:text-white underline underline-offset-8 transition-all"
            >
              Soporte
            </Link>
            <Link 
              href="/careers" 
              className="font-inter text-[10px] tracking-widest uppercase text-secondary/70 hover:text-white underline underline-offset-8 transition-all"
            >
              Carreras
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
