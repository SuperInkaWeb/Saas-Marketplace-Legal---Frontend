"use client";

import { useState } from "react";
import { SearchFilters } from "@/components/marketplace/SearchFilters";
import { LawyerCard } from "@/components/marketplace/LawyerCard";
import { useSearchLawyers, useSpecialties } from "@/modules/marketplace/hooks";
import { useMe } from "@/modules/auth/hooks";
import { SearchParams } from "@/modules/marketplace/types";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function MarketplacePage() {
  const [params, setParams] = useState<SearchParams>({
    page: 0,
    size: 10,
  });

  const { data: userData } = useMe();
  const { data: lawyersData, isLoading: isLoadingLawyers, isError: isErrorLawyers } = useSearchLawyers(params);
  const { data: specialties = [], isLoading: isLoadingSpecialties } = useSpecialties();

  // Fallback search: First try SAME specialty in OTHER cities, then just high-rated
  const { data: featuredData, isLoading: isLoadingFeatured } = useSearchLawyers({
    page: 0,
    size: 4,
    specialtyId: params.specialtyId,
    minRating: params.minRating || 4,
  }, { 
    enabled: !!lawyersData && lawyersData.totalElements === 0 
  });

  const hasNoResults = !isLoadingLawyers && !!lawyersData && lawyersData.totalElements === 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface selection:bg-secondary/30 pt-32 pb-20 px-6 sm:px-12 max-w-screen-2xl mx-auto">
        {/* Breadcrumb & Header */}
        <header className="mb-12 max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-4">
            <span>Inicio</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-secondary font-bold">Encuentra al abogado ideal</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-primary mb-2 font-manrope">
                Resultados de Búsqueda
              </h1>
              <p className="text-on-surface-variant font-medium">
                {isLoadingLawyers ? (
                  "Buscando profesionales verificados..."
                ) : (
                  `Mostrando ${lawyersData?.totalElements || 0} profesionales verificados en tu zona.`
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl">
              <button className="px-4 py-2 text-xs font-bold uppercase tracking-tighter bg-surface-container-lowest shadow-sm rounded-lg">Lista</button>
              <button className="px-4 py-2 text-xs font-bold uppercase tracking-tighter text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg">Mapa</button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <SearchFilters
              params={params}
              setParams={setParams}
              specialties={specialties}
              userCity={userData?.city}
            />
          </aside>

          {/* Results Section */}
          <main className="flex-grow">
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <AnimatePresence mode="popLayout">
                {isLoadingLawyers ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="h-96 bg-surface-container-low rounded-xl animate-pulse"
                    />
                  ))
                ) : isErrorLawyers ? (
                  <div className="col-span-full py-20 text-center">
                    <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
                    <p className="text-on-surface-variant font-bold text-lg">Ocurrió un error al cargar los abogados.</p>
                  </div>
                ) : hasNoResults ? (
                  <div className="col-span-full space-y-12">
                    <div className="py-16 text-center bg-surface-container-lowest rounded-3xl border-2 border-dashed border-surface-container-highest shadow-inner">
                      <span className="material-symbols-outlined text-6xl text-surface-container-highest mb-4">search_off</span>
                      <h3 className="text-2xl font-black text-primary tracking-tight">Vaya, no hay resultados exactos</h3>
                      <p className="text-on-surface-variant mt-2 max-w-sm mx-auto text-sm font-bold">
                        No encontramos resultados para <span className="text-secondary">"{params.query || "tu búsqueda"}"</span> con los filtros actuales.
                      </p>
                      <button
                        onClick={() => setParams({ page: 0, size: 10 })}
                        className="mt-8 bg-surface-container text-secondary px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-sm"
                      >
                        Limpiar Filtros
                      </button>
                    </div>

                    {/* Suggestions Section */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-grow bg-surface-container-high"></div>
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant">Expertos destacados recomendados</h4>
                        <div className="h-px flex-grow bg-surface-container-high"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {isLoadingFeatured ? (
                           Array.from({ length: 2 }).map((_, i) => (
                            <div key={`sug-skeleton-${i}`} className="h-96 bg-surface-container-low rounded-xl animate-pulse" />
                          ))
                        ) : (
                          featuredData?.content.map((lawyer) => (
                            <LawyerCard key={lawyer.publicId} lawyer={lawyer} />
                          ))
                        )}
                      </div>
                      
                      <div className="mt-12 p-8 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                         <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                             <span className="material-symbols-outlined text-3xl">language</span>
                           </div>
                           <div>
                             <p className="font-black text-primary tracking-tight">Atención remota disponible</p>
                             <p className="text-xs text-on-surface-variant font-medium">Muchos de nuestros expertos ofrecen consultas virtuales seguras.</p>
                           </div>
                         </div>
                         <button className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">
                           Explorar Todo
                         </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  lawyersData?.content.map((lawyer) => (
                    <LawyerCard key={lawyer.publicId} lawyer={lawyer} />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {!hasNoResults && lawyersData && lawyersData.totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-12">
                {Array.from({ length: lawyersData.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setParams((prev) => ({ ...prev, page: i }))}
                    className={`w-10 h-10 rounded-lg font-black text-xs transition-all duration-300 ${
                      params.page === i
                        ? "bg-secondary text-white shadow-lg scale-110"
                        : "bg-surface-container-lowest border border-surface-container-highest text-on-surface-variant hover:border-secondary hover:text-secondary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
