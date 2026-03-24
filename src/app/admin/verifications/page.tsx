"use client";

import { useState } from "react";
import { useAdminPendingLawyers, useVerifyLawyer } from "@/modules/admin/hooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldBan,
  Loader2,
  MapPin,
  FileText,
  Scale,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminVerificationsPage() {
  const { data: lawyers, isLoading } = useAdminPendingLawyers();
  const verifyMutation = useVerifyLawyer();

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleVerify = async (userPublicId: string) => {
    if (!confirm("¿Confirmas la verificación de este abogado?")) return;

    try {
      await verifyMutation.mutateAsync({
        userPublicId,
        body: { verificationStatus: "VERIFIED" },
      });
      toast.success("Abogado verificado exitosamente.");
    } catch {
      toast.error("Error al verificar al abogado.");
    }
  };

  const handleReject = async (userPublicId: string) => {
    try {
      await verifyMutation.mutateAsync({
        userPublicId,
        body: {
          verificationStatus: "REJECTED",
          rejectionReason: rejectionReason || undefined,
        },
      });
      toast.success("Verificación rechazada.");
      setRejectingId(null);
      setRejectionReason("");
    } catch {
      toast.error("Error al rechazar la verificación.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <div className="bg-slate-900 px-6 pt-12 pb-20 lg:px-10 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-amber-300 text-xs font-medium mb-4 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verificaciones Pendientes
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Verificación de <span className="text-amber-400">Abogados</span>
            </h1>
            <p className="text-slate-300 mt-2 text-lg">
              Revisa la documentación KYC y aprueba o rechaza a los abogados que solicitan verificación.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 -mt-10 relative z-20 space-y-5">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : !lawyers || lawyers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center shadow-sm"
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No hay verificaciones pendientes</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Todos los abogados han sido revisados. Cuando un nuevo abogado suba su documentación, aparecerá aquí.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {lawyers.map((lawyer, i) => (
              <motion.div
                key={lawyer.userPublicId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  {/* Lawyer Info */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{lawyer.fullName}</h3>
                        <p className="text-sm text-slate-500">{lawyer.email}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{lawyer.city}{lawyer.country ? `, ${lawyer.country}` : ""}</span>
                        </div>

                        {lawyer.barRegistrationNumber && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Scale className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>Colegiatura: {lawyer.barRegistrationNumber}</span>
                          </div>
                        )}

                        {lawyer.barAssociation && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{lawyer.barAssociation}</span>
                          </div>
                        )}

                        <div className="text-xs text-slate-400 font-medium">
                          Registrado el {format(new Date(lawyer.createdAt), "dd MMM yyyy", { locale: es })}
                        </div>
                      </div>

                      {/* KYC Info */}
                      {lawyer.kycDocumentType && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Documento KYC</h4>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span><strong>Tipo:</strong> {lawyer.kycDocumentType}</span>
                            <span><strong>Número:</strong> {lawyer.kycDocumentNumber}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 lg:items-end shrink-0">
                      <button
                        onClick={() => handleVerify(lawyer.userPublicId)}
                        disabled={verifyMutation.isPending}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Aprobar Verificación
                      </button>

                      {rejectingId === lawyer.userPublicId ? (
                        <div className="space-y-2 w-full lg:w-72">
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Motivo del rechazo (opcional)..."
                            className="w-full px-4 py-2 bg-slate-50 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                            rows={2}
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReject(lawyer.userPublicId)}
                              disabled={verifyMutation.isPending}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Confirmar Rechazo
                            </button>
                            <button
                              onClick={() => { setRejectingId(null); setRejectionReason(""); }}
                              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-100 rounded-lg transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setRejectingId(lawyer.userPublicId)}
                          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-red-200"
                        >
                          <ShieldBan className="w-4 h-4" />
                          Rechazar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
