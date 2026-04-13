"use client";

import { motion } from "framer-motion";
import { SpecialtyResponse, SearchParams } from "../../modules/marketplace/types";

interface SearchFiltersProps {
  params: SearchParams;
  setParams: (params: SearchParams | ((prev: SearchParams) => SearchParams)) => void;
  specialties: SpecialtyResponse[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export function SearchFilters({ params, setParams, specialties }: SearchFiltersProps) {
  const clearFilters = () => {
    setParams({ page: 0, size: 6 });
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col"
    >
      <motion.div variants={itemVariants} className="mb-10">
        <p className="font-inter text-[10px] uppercase tracking-[0.4em] text-accent font-black mb-2">PRECISIÓN</p>
        <p className="font-manrope text-2xl font-bold tracking-tight text-primary uppercase">Directorio</p>
      </motion.div>

      <nav className="space-y-1">
        <motion.div 
          variants={itemVariants}
          onClick={clearFilters}
          className={`group flex items-center gap-4 px-4 py-4 cursor-pointer transition-all font-inter text-[10px] uppercase tracking-[0.2em] relative overflow-hidden ${
            !params.specialtyId 
              ? "text-primary font-bold bg-surface-container-high border-l-2 border-accent" 
              : "text-secondary hover:text-primary hover:bg-surface-container-low"
          }`}
        >
          <span className="material-symbols-outlined text-lg">business_center</span>
          <span>Todas las Áreas</span>
        </motion.div>

        {specialties.map((specialty) => (
          <motion.div 
            key={specialty.id}
            variants={itemVariants}
            onClick={() => setParams(p => ({ ...p, specialtyId: specialty.id, page: 0 }))}
            className={`group flex items-center gap-4 px-4 py-4 cursor-pointer transition-all font-inter text-[10px] uppercase tracking-[0.2em] border-l-2 ${
              params.specialtyId === specialty.id 
                ? "text-primary font-bold bg-surface-container-high border-accent" 
                : "text-secondary border-transparent hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {specialty.name.toLowerCase().includes('litig') ? 'gavel' : 
               specialty.name.toLowerCase().includes('prop') ? 'copyright' :
               specialty.name.toLowerCase().includes('corp') ? 'business' : 'balance'}
            </span>
            <span>{specialty.name}</span>
          </motion.div>
        ))}
      </nav>

      <motion.div variants={itemVariants} className="mt-16 space-y-10">
        <div className="group">
          <label className="font-inter text-[10px] uppercase tracking-[0.3em] text-secondary/40 mb-4 block font-black group-hover:text-accent transition-colors">Ubicación</label>
          <div className="relative">
            <input 
              type="text"
              placeholder="Ej: Lima, Perú"
              value={params.query || ""}
              onChange={(e) => setParams(p => ({ ...p, query: e.target.value || undefined, page: 0 }))}
              className="w-full bg-transparent border-b border-outline-variant text-[11px] font-bold uppercase tracking-widest text-primary focus:ring-0 rounded-none py-3 px-1 transition-all focus:border-accent placeholder:text-outline-variant"
            />
          </div>
        </div>

        <div>
          <label className="font-inter text-[10px] uppercase tracking-[0.3em] text-secondary/40 mb-6 block font-black">Calificación</label>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.span 
                key={star}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setParams(p => ({ ...p, minRating: star, page: 0 }))}
                className={`material-symbols-outlined text-lg cursor-pointer transition-all ${
                  (params.minRating || 0) >= star ? "text-accent" : "text-outline-variant"
                }`}
                style={{ fontVariationSettings: (params.minRating || 0) >= star ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </motion.span>
            ))}
          </div>
        </div>

        {(params.query || params.specialtyId || params.minRating) && (
          <motion.button
            whileHover={{ x: 5 }}
            onClick={clearFilters}
            className="w-full py-4 text-[9px] font-black text-accent uppercase tracking-[0.4em] hover:text-primary transition-colors border-t border-outline-variant/10 mt-8 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xs">refresh</span>
            Reiniciar Directorio
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
