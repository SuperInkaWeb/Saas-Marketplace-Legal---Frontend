"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, User, Scale, ArrowRight, Loader2, 
  X, ChevronRight, Sparkles, MessageSquare
} from "lucide-react";
import { marketplaceService } from "@/modules/marketplace/services/marketplaceService";

interface Suggestion {
  id: string | number;
  type: "specialty" | "lawyer" | "help";
  label: string;
  sublabel?: string;
  value: string;
}

export function SmartSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load baseline specialties on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await marketplaceService.getAllSpecialties();
        setSpecialties(data);
      } catch (err) {
        console.error("Error loading specialties", err);
      }
    };
    loadData();
  }, []);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (val: string) => {
    if (val.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Local Specialties Filter
      const matchedSpecs: Suggestion[] = specialties
        .filter(s => s.name.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 3)
        .map(s => ({
          id: s.id,
          type: "specialty",
          label: s.name,
          sublabel: "Especialidad Jurídica",
          value: s.name
        }));

      // 2. API Lawyer Search
      const lawyerData = await marketplaceService.searchLawyers({ query: val, size: 3 });
      const matchedLawyers: Suggestion[] = (lawyerData.content || []).map((l: any) => ({
        id: l.publicId,
        type: "lawyer",
        label: l.fullName || "Abogado",
        sublabel: l.specialties?.[0] || "Abogado Colegiado",
        value: l.slug
      }));

      // 3. Help / FAQ Intent (Deterministic)
      const helpIntent: Suggestion[] = [];
      if (val.includes("?") || val.length > 20) {
        helpIntent.push({
          id: "help-query",
          type: "help",
          label: "¿Necesitas ayuda personalizada?",
          sublabel: "Regístrate para usar nuestro Asistente IA",
          value: "/register"
        });
      }

      setSuggestions([...matchedSpecs, ...matchedLawyers, ...helpIntent]);
      setIsOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [specialties]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleAction = async (item?: Suggestion) => {
    const target = item || { type: "search", value: query };
    setIsOpen(false);

    if (target.type === "specialty") {
      router.push(`/marketplace?specialtyId=${target.id}`);
    } else if (target.type === "lawyer") {
      router.push(`/lawyer/${target.value}`);
    } else if (target.type === "help") {
      router.push(target.value);
    } else {
      router.push(`/marketplace?query=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        handleAction(suggestions[selectedIndex]);
      } else if (query) {
        handleAction();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full relative z-50">
      <div className="group flex items-center bg-surface-container-low border-b-2 border-primary focus-within:border-accent transition-all pl-6 pr-4 md:pr-6">
        {/* Search Icon */}
        <div className="shrink-0 flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-accent transition-colors" />
          )}
        </div>
        
        {/* Input Field */}
        <input
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="flex-1 bg-transparent py-8 px-4 md:px-6 text-xl md:text-2xl font-manrope tracking-tight focus:outline-none transition-all uppercase placeholder:text-on-surface-variant/30 lowercase min-w-0"
          placeholder="Busca por especialidad, nombre de abogado o consulta legal..."
          type="text"
          autoComplete="off"
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {query && (
            <button 
              onClick={() => { setQuery(""); setSuggestions([]); }}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors shrink-0"
            >
              <X className="w-4 h-4 text-on-surface-variant/60" />
            </button>
          )}
          <button
            onClick={() => handleAction()}
            className="flex items-center gap-2 group/btn bg-primary text-on-primary px-4 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-accent transition-all duration-300 shrink-0"
          >
            <span className="hidden md:inline text-[10px] font-black tracking-[0.2em] uppercase">Buscar ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant/20 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="p-2">
              <div className="px-4 py-2 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-[0.2em]">
                Resultados sugeridos
              </div>
              <div className="space-y-1">
                {suggestions.map((item, idx) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => handleAction(item)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all text-left ${
                      selectedIndex === idx 
                        ? "bg-primary text-on-primary shadow-lg scale-[1.01]" 
                        : "hover:bg-surface-container-high text-primary"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      selectedIndex === idx ? "bg-white/20" : "bg-primary/5"
                    }`}>
                      {item.type === "specialty" && <Scale className="w-4 h-4" />}
                      {item.type === "lawyer" && <User className="w-4 h-4" />}
                      {item.type === "help" && <MessageSquare className="w-4 h-4" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate uppercase tracking-tight">
                        {item.label}
                      </div>
                      <div className={`text-[10px] font-medium uppercase tracking-wider ${
                        selectedIndex === idx ? "text-on-primary/70" : "text-on-surface-variant/60"
                      }`}>
                        {item.sublabel}
                      </div>
                    </div>
                    
                    {selectedIndex === idx && (
                      <motion.div layoutId="arrow" className="shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-surface-container-high/50 p-4 border-t border-outline-variant/10 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] font-bold text-on-surface-variant/40 uppercase">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-surface-container-highest rounded border border-outline-variant/30 text-[9px]">ENTER</kbd> Seleccionar</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-surface-container-highest rounded border border-outline-variant/30 text-[9px]">↑↓</kbd> Navegar</span>
              </div>
              <div className="flex items-center gap-1.5 text-accent text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                Smart Search
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
