"use client";

import { useEffect, useState } from "react";
import { 
  ShieldAlert, 
  Trash2, 
  CheckCircle2, 
  User as UserIcon, 
  MessageSquare, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Search,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { marketplaceApi } from "@/modules/marketplace/api";
import { ReviewReportDTO, ReportStatus, ReportReason } from "@/modules/marketplace/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const REASON_LABELS: Record<ReportReason, string> = {
  [ReportReason.SPAM]: "Spam / Irrelevante",
  [ReportReason.OFFENSIVE_LANGUAGE]: "Lenguaje Ofensivo",
  [ReportReason.FALSE_INFORMATION]: "Información Falsa",
  [ReportReason.UNFAIR_CRITICISM]: "Crítica sin Fundamento",
  [ReportReason.OTHER]: "Otros",
};

export default function AdminModerationPage() {
  const [reports, setReports] = useState<ReviewReportDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await marketplaceApi.getReviewReports();
      setReports(data);
    } catch (error) {
      toast.error("Error al cargar los reportes de moderación");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (publicId: string, deleteReview: boolean) => {
    try {
      setResolvingId(publicId);
      await marketplaceApi.resolveReviewReport(publicId, deleteReview);
      
      toast.success(
        deleteReview 
          ? "Reseña eliminada y reporte cerrado" 
          : "Reporte descartado correctamente"
      );
      
      fetchReports();
    } catch (error) {
      toast.error("Error al procesar la moderación");
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
            Moderación de Reseñas
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestiona las denuncias de los abogados y mantén la integridad de la plataforma.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest text-[10px]">Pendientes</span>
            <span className="bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">
              {reports.length}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
             <div className="w-12 h-12 border-4 border-slate-100 border-t-rose-500 rounded-full animate-spin" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando denuncias...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
               <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Todo en orden</h3>
            <p className="text-slate-500 mt-2">No hay denuncias pendientes de revisión en este momento.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.map((report) => (
              <motion.div 
                key={report.publicId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left: Report Info */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-black text-rose-600 uppercase tracking-tighter">Reportado por</span>
                             <span className="text-sm font-bold text-slate-900">{report.reporterName}</span>
                          </div>
                          <div className="text-xs text-slate-400 font-medium mt-0.5">
                            {format(new Date(report.createdAt), "d 'de' MMMM, HH:mm", { locale: es })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
                        {REASON_LABELS[report.reason]}
                      </div>
                    </div>

                    {/* The problem */}
                    <div className="bg-rose-50/30 rounded-2xl p-6 border border-rose-100/50">
                      <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        Motivo de la denuncia
                      </h4>
                      <p className="text-slate-700 font-medium text-sm leading-relaxed">
                        {report.details || "El abogado no proporcionó detalles adicionales sobre la denuncia."}
                      </p>
                    </div>

                    {/* The Review Content */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                             <UserIcon className="w-4 h-4" />
                           </div>
                           <span className="text-sm font-bold text-slate-900">{report.clientName}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed italic">
                        "{report.reviewComment}"
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="lg:w-64 flex flex-col gap-3 justify-center">
                    <button
                      onClick={() => handleResolve(report.publicId, true)}
                      disabled={!!resolvingId}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                    >
                      {resolvingId === report.publicId ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Eliminar Reseña
                    </button>
                    
                    <button
                      onClick={() => handleResolve(report.publicId, false)}
                      disabled={!!resolvingId}
                      className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Mantener Reseña
                    </button>

                    <p className="text-[10px] text-center text-slate-400 font-medium px-4 mt-2">
                       Al eliminar, el rating del abogado se recalculará automáticamente.
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
