"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LawyerSearchResponse } from "../../modules/marketplace/types";

interface LawyerCardProps {
  lawyer: LawyerSearchResponse;
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      className="group bg-white flex flex-col sm:flex-row items-stretch relative transition-all duration-300 border border-gray-100 hover:border-accent/40 shadow-sm hover:shadow-xl overflow-hidden rounded-md h-full"
    >
      {/* Imagen: Cambio a sm:flex-row para aprovechar pantallas medianas (tablets).
        Uso de aspect-video en móviles para evitar scroll infinito, regresando a altura completa en sm+
      */}
      <div className="w-full sm:w-2/5 lg:w-48 xl:w-56 shrink-0 relative bg-gray-50 aspect-video sm:aspect-auto">
        {lawyer.avatarUrl ? (
          <img
            src={lawyer.avatarUrl}
            alt={lawyer.fullName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5 min-h-[200px] sm:min-h-full">
            <span className="material-symbols-outlined text-5xl text-primary/10">account_circle</span>
          </div>
        )}
        
        {/* Etiqueta Premium: Flotante en móviles, anclada en escritorio */}
        {lawyer.isVerified && (
          <div className="absolute top-3 left-3 sm:top-0 sm:left-0 bg-primary px-3 py-1.5 flex items-center gap-1.5 shadow-md sm:shadow-lg rounded-sm sm:rounded-none sm:rounded-br-md z-10">
             <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
             <span className="text-[9px] font-black text-white uppercase tracking-widest">Premium</span>
          </div>
        )}
      </div>

      {/* Contenido: Padding fluido (p-5 a p-8) e interlineado ajustado */}
      <div className="flex-1 p-5 sm:p-6 md:p-8 flex flex-col min-w-0">
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-start gap-3 mb-1.5">
          <h3 className="text-xl md:text-2xl font-bold text-primary font-manrope leading-tight break-words">
            {lawyer.fullName}
          </h3>
          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-md shrink-0 border border-gray-100">
            <span className="material-symbols-outlined text-accent text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-xs font-bold text-primary">{lawyer.ratingAvg?.toFixed(1) || "5.0"}</span>
          </div>
        </div>

        {/* Tipografía: Escala responsiva en tracking y tamaño */}
        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-accent mb-4 md:mb-6">
          {lawyer.specialties?.[0] || "Arquitecto Legal"}
        </p>

        <p className="text-sm text-gray-500 font-inter leading-relaxed line-clamp-3 sm:line-clamp-2 lg:line-clamp-3 mb-6 md:mb-8">
          {lawyer.bio || "Especialista en arquitectura legal estratégica y defensa de activos complejos."}
        </p>

        {/* Footer: Manejo de flex-wrap para evitar roturas en móviles pequeños */}
        <div className="mt-auto pt-5 md:pt-6 border-t border-gray-50 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 md:gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Tarifa / h</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-accent">{lawyer.currency || "USD"}</span>
              <span className="text-xl md:text-2xl font-bold text-primary leading-none">
                {lawyer.hourlyRate && lawyer.hourlyRate > 0 ? lawyer.hourlyRate : "--"}
              </span>
            </div>
          </div>

          {/* Botón: Ancho completo en móvil para UX táctil, automático en tablet/desktop */}
          <Link
            href={`/lawyer/${lawyer.slug}`}
            className="w-full sm:w-auto bg-primary text-white px-6 md:px-8 py-3 md:py-3.5 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary transition-all duration-300 text-center rounded-sm"
          >
            Ver Trayectoria
          </Link>
        </div>
      </div>
    </motion.div>
  );
}