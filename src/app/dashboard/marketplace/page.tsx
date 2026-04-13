"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { marketplaceService } from "@/modules/marketplace/services/marketplaceService";
import type { CaseRequestResponse } from "@/modules/marketplace/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Briefcase, DollarSign, Send, FileText, UserCircle, X, Loader2, Sparkles, MapPin, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function MarketplacePage() {
  const user = useAuthStore((s) => s.user);
  const [cases, setCases] = useState<CaseRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCase, setSelectedCase] = useState<CaseRequestResponse | null>(null);
  const [proposalText, setProposalText] = useState("");
  const [proposedFee, setProposedFee] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOpenCases();
  }, []);

  const fetchOpenCases = async () => {
    try {
      setLoading(true);
      const data = await marketplaceService.getOpenCases();
      setCases(data);
    } catch (error) {
      toast.error("Error al cargar las solicitudes de casos");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProposal = (c: CaseRequestResponse) => {
    setSelectedCase(c);
    setProposalText("");
    setProposedFee(c.budget || "");
  };

  const handleSubmitProposal = async () => {
    if (!selectedCase) return;
    if (!proposalText || !proposedFee) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      setSubmitting(true);
      await marketplaceService.submitProposal(selectedCase.publicId, {
        proposalText,
        proposedFee: Number(proposedFee)
      });
      toast.success("Propuesta enviada exitosamente");
      setSelectedCase(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al enviar la propuesta");
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role !== "LAWYER") {
    return (
      <div className="p-12 max-w-7xl mx-auto flex justify-center py-40">
        <div className="text-center max-w-md bg-white p-12 shadow-xl border border-slate-50">
          <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-8" />
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-4">Acceso Restringido</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            Solo operadores legales verificados pueden acceder a la galería de demandas privadas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-14 max-w-7xl mx-auto">
      {/* Lex Architect Header */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-10 h-[2px] bg-amber-500"></span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Mercado Libre de Casos</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase font-manrope leading-[0.9]">
          Galería de <br /> Demandas
        </h1>
        <p className="mt-8 text-slate-400 font-inter text-sm max-w-xl leading-relaxed">
          Explore las solicitudes de representación legal activa. Analice los requerimientos técnicos y presente su propuesta formal de servicios.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Sincronizando Galería...</span>
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-32 bg-white border border-slate-50 shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
          <FileText className="w-12 h-12 text-slate-100 mx-auto mb-8" />
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">No hay casos activos</h3>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-4">La galería se encuentra vacía en este momento.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {cases.map((c) => (
            <motion.div
              key={c.publicId}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 border border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.06)] transition-all flex flex-col h-full group"
            >
              <div className="flex justify-between items-start mb-10">
                <span className="text-[9px] font-black text-white bg-slate-900 px-4 py-1.5 uppercase tracking-[0.2em] shadow-lg">
                  {c.specialtyName || "General"}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Presupuesto</span>
                  <span className="text-2xl font-black text-slate-900 font-manrope">
                    {c.budget ? `$${c.budget.toLocaleString('es-ES')}` : "A DEFINIR"}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 leading-none mb-6 line-clamp-2 uppercase font-manrope tracking-tight group-hover:text-amber-600 transition-colors">
                {c.title}
              </h3>
              
              <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-4 mb-10 flex-1">
                {c.description}
              </p>
              
              <div className="pt-8 border-t border-slate-50 mt-auto">
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div>
                    <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest block mb-2">Solicitante</span>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                       {c.clientName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest block mb-2">Ingreso</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase">
                      {format(new Date(c.createdAt), "dd/MM/yyyy", { locale: es })}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleOpenProposal(c)}
                  className="w-full bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] py-5 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
                >
                  <Send className="w-4 h-4 text-amber-500 group-hover/btn:translate-x-1 transition-transform" />
                  Presentar Propuesta
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lex Architect Proposal Modal */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white shadow-[0_40px_100px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
            >
              <div className="flex items-center justify-between p-10 border-b border-slate-50 bg-slate-50/30">
                <div className="border-l-4 border-amber-500 pl-6">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Propuesta Técnica</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 line-clamp-1">{selectedCase.title}</p>
                </div>
                <button 
                  onClick={() => setSelectedCase(null)} 
                  className="bg-white p-3 text-slate-300 hover:text-slate-900 transition-colors shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 overflow-y-auto custom-scrollbar space-y-10">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Plan de Ejecución Legal</label>
                  <textarea
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                    placeholder="Especifique su estrategia técnica y experiencia relevante para este requerimiento..."
                    className="w-full text-sm font-medium text-slate-700 bg-slate-50 border border-slate-100 p-6 focus:ring-1 focus:ring-amber-500 outline-none resize-none h-48 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4 text-center md:text-left">
                    <label className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Honorarios Requeridos (USD)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-amber-600" />
                      </div>
                      <input
                        type="number"
                        value={proposedFee}
                        onChange={(e) => setProposedFee(Number(e.target.value))}
                        placeholder="0.00"
                        className="w-full pl-12 pr-6 py-5 bg-white border border-slate-100 text-xl font-black text-slate-900 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                      />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Presupuesto del cliente: {selectedCase.budget} USD</p>
                  </div>
                  
                  <div className="flex flex-col justify-center gap-4 bg-slate-50 p-6 text-center">
                    <Sparkles className="w-6 h-6 text-amber-500 mx-auto" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                      Su propuesta será analizada por el cliente bajo criterios de precisión y prestigio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-10 border-t border-slate-50 bg-white">
                <button
                  disabled={submitting || !proposalText || !proposedFee}
                  onClick={handleSubmitProposal}
                  className="w-full bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] py-6 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-amber-500" /> Ejecutar Envío de Propuesta
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
