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
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
      }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="group bg-surface-container-lowest p-6 lg:p-10 flex flex-col sm:flex-row gap-8 items-start relative transition-all duration-500 hover:bg-white border-b-2 border-transparent hover:border-accent shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
    >
      <div className="w-full sm:w-48 h-64 flex-shrink-0 bg-surface-container-high relative overflow-hidden flex items-center justify-center">
        {lawyer.avatarUrl ? (
          <motion.img
            src={lawyer.avatarUrl}
            alt={lawyer.fullName}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-full object-cover transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-300">account_circle</span>
          </div>
        )}
        {lawyer.isVerified && (
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-0 left-0 bg-primary px-3 py-1"
          >
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Membresía Premium</span>
          </motion.div>
        )}
      </div>

      <div className="flex-1 flex flex-col h-full w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <motion.h3 
              whileHover={{ x: 5 }}
              className="text-2xl font-black tracking-tighter text-primary font-manrope uppercase"
            >
              {lawyer.fullName}
            </motion.h3>
            <p className="font-inter text-xs uppercase tracking-[0.2em] text-secondary/60 mt-1 font-bold">
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
            {lawyer.specialties?.slice(0, 2).map((s, idx) => (
              <motion.span 
                key={s} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="bg-surface-container-low px-3 py-1 text-[9px] font-black uppercase tracking-widest border-l-2 border-accent"
              >
                {s}
              </motion.span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-outline-variant/10 pt-6">
            <div>
              <p className="text-[10px] text-secondary/40 uppercase tracking-widest font-black">Tarifa por Hora</p>
              <motion.p 
                whileHover={{ scale: 1.1, color: "#f59e0b" }}
                className="text-lg font-black font-manrope text-primary"
              >
                {lawyer.hourlyRate && lawyer.hourlyRate > 0 
                  ? `${lawyer.currency} ${lawyer.hourlyRate}` 
                  : "Por definir"}
              </motion.p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                href={`/lawyer/${lawyer.slug}`}
                className="block bg-primary text-on-primary px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all text-center"
              >
                Ver Perfil
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

