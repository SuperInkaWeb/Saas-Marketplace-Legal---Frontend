"use client";

import { Search, MapPin, Filter, FilterX, Star } from "lucide-react";
import { SearchParams, SpecialtyResponse } from "../../modules/marketplace/types";

interface SearchFiltersProps {
  params: SearchParams;
  setParams: (params: SearchParams | ((prev: SearchParams) => SearchParams)) => void;
  specialties: SpecialtyResponse[];
  userCity?: string;
}

export function SearchFilters({ params, setParams, specialties, userCity }: SearchFiltersProps) {
  const clearFilters = () => {
    setParams({ page: 0, size: 10 });
  };

  const toggleMyCity = () => {
    if (params.query === userCity) {
      setParams((prev) => ({ ...prev, query: undefined, page: 0 }));
    } else {
      setParams((prev) => ({ ...prev, query: userCity, page: 0 }));
    }
  };

  return (
    <div className="flex flex-col p-6 bg-surface-container-low h-auto sticky top-24 rounded-3xl border border-surface-container-high shadow-sm">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="font-manrope text-sm font-black uppercase tracking-[0.2em] text-secondary">Filtros</h2>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase mt-1">Refina tu búsqueda</p>
        </div>
        {(params.query || params.specialtyId || params.minRating) && (
          <button
            onClick={clearFilters}
            className="p-1.5 hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors text-on-surface-variant"
            title="Limpiar filtros"
          >
            <span className="material-symbols-outlined text-xl">filter_list_off</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* City Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">search</span>
            Búsqueda
          </label>
          
          {userCity && (
            <button
              onClick={toggleMyCity}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-inter text-xs font-bold ${
                params.query === userCity
                  ? "bg-secondary text-white shadow-md ring-2 ring-secondary/20"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high border border-surface-container-highest"
              }`}
            >
              <span>En {userCity}</span>
              <span className={`material-symbols-outlined text-sm ${params.query === userCity ? "text-white" : "text-secondary"}`}>
                {params.query === userCity ? "check_circle" : "radio_button_unchecked"}
              </span>
            </button>
          )}

          <div className="relative group">
            <input 
              type="text" 
              placeholder="Nombre o ciudad..." 
              value={params.query && params.query !== userCity ? params.query : ""}
              onChange={(e) => setParams(p => ({...p, query: e.target.value || undefined, page: 0}))}
              className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all placeholder:text-on-surface-variant/50"
            />
          </div>
        </div>

        {/* Specialty Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">gavel</span>
            Especialidad
          </label>
          <div className="relative">
            <select
              value={params.specialtyId || ""}
              onChange={(e) => setParams(p => ({...p, specialtyId: e.target.value ? Number(e.target.value) : undefined, page: 0}))}
              className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-3 text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
            >
              <option value="">Todas las especialidades</option>
              {specialties.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Rating Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">star</span>
            Calificación
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[4, 3, 2, 1].map(r => (
              <button
                key={r}
                onClick={() => setParams(p => ({...p, minRating: p.minRating === r ? undefined : r, page: 0}))}
                className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all ${
                  params.minRating === r
                    ? "bg-secondary text-white shadow-md scale-105"
                    : "bg-surface-container-lowest text-on-surface-variant border border-surface-container-highest hover:bg-surface-container-high"
                }`}
              >
                <span className="text-xs font-black">{r}+</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Selection Tags */}
        <div className="pt-4 border-t border-surface-container-high">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Acceso Rápido</span>
          <div className="flex flex-wrap gap-2">
            {specialties.slice(0, 5).map(s => (
              <button
                key={s.id}
                onClick={() => setParams(p => ({...p, specialtyId: s.id, page: 0}))}
                className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all ${
                  params.specialtyId === s.id
                    ? "bg-secondary text-white shadow-sm"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-secondary border border-surface-container-highest"
                }`}
              >
                {s.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="mt-12 w-full py-3 text-[10px] font-black text-on-surface-variant uppercase tracking-widest hover:text-error transition-colors flex items-center justify-center gap-2 group"
      >
        <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">refresh</span>
        Reiniciar filtros
      </button>
    </div>
  );
}
