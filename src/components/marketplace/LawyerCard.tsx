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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-surface-container-lowest p-6 lg:p-10 flex flex-col sm:flex-row gap-8 items-start relative transition-all duration-500 hover:bg-white border-b-2 border-transparent hover:border-accent"
    >
      <div className="w-full sm:w-48 h-64 flex-shrink-0 bg-surface-container-high relative overflow-hidden flex items-center justify-center">
        {lawyer.avatarUrl ? (
          <img
            src={lawyer.avatarUrl}
            alt={lawyer.fullName}
            className="w-full h-full object-cover transition-all duration-700 scale-110 group-hover:scale-100"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-300">account_circle</span>
          </div>
        )}
        {lawyer.isVerified && (
          <div className="absolute bottom-0 left-0 bg-primary px-3 py-1">
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Membresía Premium</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col h-full w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-primary font-manrope uppercase">
              {lawyer.fullName}
            </h3>
            <p className="font-inter text-xs uppercase tracking-widest text-secondary mt-1">
              {lawyer.specialties?.[0] || "Consultor Legal"}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1">
            <span 
              className="material-symbols-outlined text-accent text-xs" 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-xs font-bold text-primary">{lawyer.ratingAvg?.toFixed(1) || "5.0"}</span>
          </div>
        </div>

        <p className="text-xs text-secondary/70 font-inter leading-relaxed mb-8 line-clamp-3 italic">
          {lawyer.bio || "Este arquitecto legal prefiere mantener una reserva estratégica sobre su biografía técnica pública."}
        </p>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-4 mb-8">
            {lawyer.specialties?.slice(0, 2).map((s) => (
              <span 
                key={s} 
                className="bg-surface-container-low px-3 py-1 text-[9px] font-bold uppercase tracking-widest border-l-2 border-accent"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] text-secondary/40 uppercase tracking-widest">Tarifa por Hora</p>
              <p className="text-lg font-bold font-manrope">
                {lawyer.hourlyRate && lawyer.hourlyRate > 0 
                  ? `${lawyer.currency} ${lawyer.hourlyRate}` 
                  : "Por definir"}
              </p>
            </div>
            <Link
              href={`/lawyer/${lawyer.slug}`}
              className="w-full sm:w-auto bg-primary text-on-primary px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent transition-all text-center"
            >
              Ver Perfil
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
