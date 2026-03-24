"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { lawyerConfigService } from "@/modules/profile/services/lawyerConfigService";
import { LawyerProposalResponse } from "@/modules/marketplace/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Send, DollarSign, Clock, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProposalsPage() {
  const user = useAuthStore((s) => s.user);
  const [proposals, setProposals] = useState<LawyerProposalResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "LAWYER") {
      fetchProposals();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const data = await lawyerConfigService.getMyProposals();
      setProposals(data);
    } catch (error) {
      console.error("Error fetching proposals", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pendiente
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Aceptada
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            <XCircle className="w-3.5 h-3.5" /> Rechazada
          </span>
        );
      default:
        return null;
    }
  };

  if (user?.role !== "LAWYER") {
    return (
      <div className="p-8 max-w-5xl mx-auto flex justify-center py-32">
        <div className="text-center">
          <Send className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Acceso Restringido</h2>
          <p className="text-slate-500 mt-2">Esta sección es solo para abogados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4">
          Mis Propuestas
        </h1>
        <p className="mt-2 text-slate-500 text-sm">
          Seguimiento de las propuestas enviadas a través del Marketplace.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Send className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Aún no has enviado propuestas</h3>
          <p className="text-slate-500 mt-1">Explora el marketplace y envía tu primer propuesta a un cliente.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {proposals.map((proposal, index) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {getStatusBadge(proposal.status)}
                  <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Enviada el {format(new Date(proposal.createdAt), "d MMM yyyy", { locale: es })}
                  </span>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {proposal.proposalText}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:w-48 bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50">
                <div className="text-left md:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Honorarios Propuestos
                  </span>
                  <div className="flex items-center md:justify-end gap-1 mt-1 text-emerald-700 font-bold text-xl">
                    <DollarSign className="w-5 h-5" />
                    {proposal.proposedFee.toLocaleString('es-ES')}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
