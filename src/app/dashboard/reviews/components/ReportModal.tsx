"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { marketplaceApi } from "@/modules/marketplace/api";
import { ReportReason } from "@/modules/marketplace/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewPublicId: string;
  clientName: string;
}

const REASONS = [
  { id: ReportReason.SPAM, label: "Spam o contenido irrelevante" },
  { id: ReportReason.OFFENSIVE_LANGUAGE, label: "Lenguaje ofensivo o acoso" },
  { id: ReportReason.FALSE_INFORMATION, label: "Información falsa o engañosa" },
  { id: ReportReason.UNFAIR_CRITICISM, label: "Crítica sin fundamento constructivo" },
  { id: ReportReason.OTHER, label: "Otros motivos" },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reviewPublicId,
  clientName,
}) => {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Por favor selecciona un motivo");
      return;
    }

    try {
      setSubmitting(true);
      await marketplaceApi.reportReview(reviewPublicId, {
        reason,
        details,
      });
      toast.success("Denuncia enviada correctamente. El administrador la revisará pronto.");
      onClose();
      // Reset
      setReason(null);
      setDetails("");
    } catch (error) {
      toast.error("Error al enviar la denuncia");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Denunciar Reseña</h3>
                  <p className="text-xs text-slate-500 font-medium">De: {clientName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest text-[10px]">
                  Selecciona el Motivo
                </label>
                <div className="grid gap-2">
                  {REASONS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setReason(r.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all text-sm font-medium",
                        reason === r.id
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                          : "bg-white border-slate-200 text-slate-600 hover:border-blue-400"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest text-[10px]">
                  Detalles Adicionales (Opcional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Explica brevemente por qué consideras que esta reseña debe ser eliminada..."
                  className="w-full min-h-[120px] p-4 rounded-2xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-white transition-all border border-transparent hover:border-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !reason}
                className={cn(
                  "px-8 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 transition-all shadow-lg",
                  submitting || !reason
                    ? "bg-slate-300 shadow-none cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                )}
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Denuncia
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
