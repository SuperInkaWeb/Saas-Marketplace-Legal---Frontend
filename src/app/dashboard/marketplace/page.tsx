"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { marketplaceService } from "@/modules/marketplace/services/marketplaceService";
import { CaseRequestResponse } from "@/modules/marketplace/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Briefcase, DollarSign, Send, FileText, UserCircle, X } from "lucide-react";
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
      // Optionally refresh cases or mark as proposed locally
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al enviar la propuesta");
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role !== "LAWYER") {
    return (
      <div className="p-8 max-w-7xl mx-auto flex justify-center py-32">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Acceso Restringido</h2>
          <p className="text-slate-500 mt-2">Solo los abogados verificados pueden acceder al marketplace de casos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4">
          Marketplace de Casos
        </h1>
        <p className="mt-2 text-slate-500 text-sm">Encuentra clientes buscando representación legal y envía tus propuestas.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No hay casos abiertos</h3>
          <p className="text-slate-500 mt-1">Actualmente no hay solicitudes de clientes disponibles en el mercado.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {cases.map((c) => (
            <motion.div
              key={c.publicId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  {c.specialtyName || "General"}
                </span>
                <span className="text-emerald-600 font-bold flex items-center bg-emerald-50 px-3 py-1 rounded-full text-sm">
                  <DollarSign className="w-4 h-4" />
                  {c.budget?.toLocaleString('es-ES') || "A convenir"}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-2">
                {c.title}
              </h3>
              
              <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
                {c.description}
              </p>
              
              <div className="border-t border-slate-100 pt-4 mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Solicitante</span>
                    <span className="text-sm font-medium text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <UserCircle className="w-4 h-4 text-slate-400" />
                      {c.clientName}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fecha</span>
                    <span className="text-sm font-medium text-slate-800 mt-0.5">
                      {format(new Date(c.createdAt), "d MMM, yyyy", { locale: es })}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleOpenProposal(c)}
                  className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Enviar Propuesta
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Proposal Modal */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Detalles de la Propuesta</h2>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 line-clamp-1">{selectedCase.title}</p>
                </div>
                <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-slate-600 bg-white shadow-sm p-2 rounded-full border border-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Mensaje o Plan de Acción</label>
                  <textarea
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                    placeholder="Explícale al cliente cómo puedes ayudarle con su caso..."
                    className="w-full text-sm rounded-xl border border-slate-200 p-4 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none resize-none h-40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Honorarios Propuestos (USD)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={proposedFee}
                      onChange={(e) => setProposedFee(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none font-medium"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">El cliente presupuestó {selectedCase.budget} USD.</p>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100">
                <button
                  disabled={submitting || !proposalText || !proposedFee}
                  onClick={handleSubmitProposal}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Enviar Propuesta Formal
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
