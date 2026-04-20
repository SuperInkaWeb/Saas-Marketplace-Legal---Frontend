"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SearchFilters } from "@/components/marketplace/SearchFilters";
import { LawyerCard } from "@/components/marketplace/LawyerCard";
import { useSearchLawyers, useSpecialties } from "@/modules/marketplace/hooks";
import { SearchParams } from "@/modules/marketplace/types";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<SearchParams>({
    page: 0,
    size: 6,
  });

  // Sync state with URL params on mount
  useEffect(() => {
    const specialtyId = searchParams.get("specialtyId");
    const query = searchParams.get("query");

    if (specialtyId || query) {
      setParams(prev => ({
        ...prev,
        specialtyId: specialtyId ? parseInt(specialtyId) : prev.specialtyId,
        query: query || prev.query,
      }));
    }
  }, [searchParams]);

  const { data: lawyersData, isLoading: isLoadingLawyers, isError: isErrorLawyers } = useSearchLawyers(params);
  const { data: specialties = [] } = useSpecialties();

  const handleLoadMore = () => {
    setParams(prev => ({ ...prev, size: (prev.size || 6) + 6 }));
  };

  const hasNoResults = !isLoadingLawyers && !!lawyersData && lawyersData.totalElements === 0;
  const hasMore = !!lawyersData && (params.size || 6) < lawyersData.totalElements;

  return (
    <div className="bg-surface selection:bg-accent/30 selection:text-white min-h-screen">
      <Navbar />
      
      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 px-6 lg:px-16 pt-32 pb-24">
        {/* Sidebar Navigation */}
        <motion.aside 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
          className="w-full lg:w-72 shrink-0"
        >
          <div className="sticky top-32">
            <SearchFilters
              params={params}
              setParams={setParams}
              specialties={specialties}
            />
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1"
        >
          <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
            <motion.div variants={itemVariants} className="max-w-2xl text-left">
              <span className="font-inter text-[10px] uppercase tracking-[0.5em] text-accent mb-8 block font-black">
                ARQUITECTURA LEGAL SOBERANA
              </span>
              <h1 className="text-6xl lg:text-7xl font-black tracking-tighter text-primary leading-[0.85] uppercase font-manrope">
                Encuentra tu <br />Arquitecto Legal.
              </h1>
              <p className="mt-10 text-secondary/60 font-inter text-sm leading-relaxed max-w-md border-l border-outline-variant/30 pl-8">
                El directorio más exclusivo de Latinoamérica. 
                Cada profesional listado ha superado una auditoría de precisión técnica y ética operativa.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-right border-l-2 border-accent pl-10 w-full md:w-auto">
              <p className="font-inter text-[10px] uppercase tracking-[0.3em] text-secondary/40 font-black mb-2">Total Archivo</p>
              <p className="text-6xl lg:text-7xl font-black font-manrope tracking-tighter text-primary">
                {isLoadingLawyers ? "..." : (lawyersData?.totalElements || 0).toLocaleString()}
              </p>
            </motion.div>
          </header>

          {/* Grid de Resultados */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <AnimatePresence mode="popLayout">
              {isLoadingLawyers && params.size === 6 ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="h-[380px] bg-slate-100 animate-pulse"
                  />
                ))
              ) : isErrorLawyers ? (
                <div className="col-span-full py-40 text-center border-2 border-dashed border-outline-variant/10">
                  <span className="material-symbols-outlined text-7xl text-error/20 mb-6">cloud_off</span>
                  <p className="text-secondary/60 font-black tracking-widest uppercase text-xs">Error de Sincronización</p>
                </div>
              ) : hasNoResults ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-40 text-center bg-white border border-outline-variant/10 p-16"
                >
                  <span className="material-symbols-outlined text-8xl text-secondary/10 mb-8">manage_search</span>
                  <h3 className="text-4xl font-black text-primary tracking-tighter uppercase mb-6">Sin Coincidencias</h3>
                  <p className="text-secondary/50 max-w-sm mx-auto text-sm leading-relaxed mb-10 font-medium">
                    No existen arquitectos legales que cumplan con los parámetros de <span className="text-primary font-black">"{params.query || "búsqueda avanzada"}"</span> en este momento.
                  </p>
                  <button
                    onClick={() => setParams({ page: 0, size: 6 })}
                    className="bg-primary text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all shadow-2xl"
                  >
                    Reiniciar Directorio
                  </button>
                </motion.div>
              ) : (
                lawyersData?.content.map((lawyer) => (
                  <LawyerCard key={lawyer.publicId} lawyer={lawyer} />
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Load More Button */}
          {hasMore && !isLoadingLawyers && (
            <motion.div variants={itemVariants} className="mt-32 flex justify-center">
              <button 
                onClick={handleLoadMore}
                className="group flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.5em] text-primary hover:text-accent transition-all"
              >
                <div className="w-20 h-[1px] bg-primary/10 group-hover:bg-accent group-hover:w-32 transition-all duration-700"></div>
                Cargar más Arquitectos
                <div className="w-20 h-[1px] bg-primary/10 group-hover:bg-accent group-hover:w-32 transition-all duration-700"></div>
              </button>
            </motion.div>
          )}

          {isLoadingLawyers && (params.size || 0) > 6 && (
            <div className="mt-32 flex justify-center text-center">
               <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}
        </motion.main>
      </div>

      <Footer />
    </div>
  );
}
