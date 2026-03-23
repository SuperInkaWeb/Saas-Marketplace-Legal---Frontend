"use client";

import { motion } from "framer-motion";
import { Star, MapPin, ShieldCheck, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LawyerSearchResponse } from "../../modules/marketplace/types";

interface LawyerCardProps {
  lawyer: LawyerSearchResponse;
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-surface-container-low">
        <img
          src={lawyer.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"}
          alt={lawyer.fullName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {lawyer.isVerified && (
          <div className="absolute top-4 left-4 bg-primary-container/90 backdrop-blur-md text-white px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase shadow-lg">
            Premium Expert
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-black tracking-tight text-primary flex items-center gap-2 font-manrope">
              {lawyer.fullName}
              {lawyer.isVerified && (
                <span 
                  className="material-symbols-outlined text-secondary text-lg" 
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              )}
            </h3>
            <p className="text-sm font-medium text-on-surface-variant">
              {lawyer.specialties?.[0] || "Abogado Generalista"}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-lg">
            <span 
              className="material-symbols-outlined text-amber-500 text-sm" 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-xs font-bold text-on-surface">{lawyer.ratingAvg?.toFixed(1) || "5.0"}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {lawyer.specialties?.slice(0, 2).map((s) => (
            <span 
              key={s} 
              className="px-2 py-1 bg-surface-container text-secondary text-[10px] font-black rounded-sm uppercase tracking-wider"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="bg-surface-container-low h-px w-full mb-6"></div>

        <div className="flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Desde</span>
            <span className="text-lg font-black text-primary">
              €{lawyer.hourlyRate || "150"}
              <small className="text-xs font-medium ml-1">/h</small>
            </span>
          </div>
          <Link
            href={`/profile/${lawyer.publicId}`}
            className="px-6 py-3 bg-primary-container text-on-primary text-xs font-black uppercase tracking-widest rounded-lg hover:bg-primary transition-all shadow-md hover:shadow-lg"
          >
            Ver Perfil
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
