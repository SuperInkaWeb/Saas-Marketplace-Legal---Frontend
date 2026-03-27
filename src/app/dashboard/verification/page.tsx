"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Hash,
  Flag,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/modules/auth/store";
import { useKycStatus, useUploadKyc, extractApiError } from "@/modules/auth/hooks";
import { kycDocumentSchema, type KycDocumentFormData } from "@/modules/auth/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { formatDocumentType } from "@/lib/format";

export default function VerificationPage() {
  const user = useAuthStore((s) => s.user);
  const { data: kycStatus, isLoading } = useKycStatus();
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { mutate: uploadKyc, isPending } = useUploadKyc();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KycDocumentFormData>({
    resolver: zodResolver(kycDocumentSchema),
  });

  const onSubmit = (data: KycDocumentFormData) => {
    setError(null);
    uploadKyc(data, {
      onSuccess: (updatedUser) => {
        updateUser(updatedUser);
        queryClient.invalidateQueries({ queryKey: ["kyc-status"] });
        queryClient.invalidateQueries({ queryKey: ["auth-me"] });
        setSubmitted(true);
      },
      onError: (err) => setError(extractApiError(err).message),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  const status = kycStatus?.verificationStatus;
  const isVerified = status === "VERIFIED";
  const isPendingReview = kycStatus?.hasDocument && status === "PENDING";
  const isRejected = status === "REJECTED";
  const needsUpload = !kycStatus?.hasDocument && !submitted;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <div className="bg-slate-900 px-6 pt-12 pb-24 lg:px-10 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Panel
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight"
          >
            Verificación Profesional
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 mt-3 text-lg max-w-xl leading-relaxed"
          >
            Completa la verificación de tu identidad para acceder a todas las funcionalidades de la plataforma.
          </motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-10 -mt-12 relative z-20">
        {/* ── VERIFIED STATE ────────────────────────────────────── */}
        {isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-emerald-200 shadow-xl shadow-emerald-900/5 overflow-hidden"
          >
            <div className="bg-emerald-50 border-b border-emerald-100 px-8 py-6 flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl ring-1 ring-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-900">¡Perfil Verificado!</h2>
                <p className="text-emerald-700 text-sm mt-0.5">Tu identidad ha sido confirmada exitosamente.</p>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-900">Insignia Visible</p>
                  <p className="text-xs text-slate-500 mt-1">Tu perfil muestra la insignia de verificado</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-900">Enviar Propuestas</p>
                  <p className="text-xs text-slate-500 mt-1">Puedes postular a cualquier caso legal</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <CreditCard className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-900">Directorio Público</p>
                  <p className="text-xs text-slate-500 mt-1">Apareces en las búsquedas de clientes</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── PENDING REVIEW STATE ──────────────────────────────── */}
        {(isPendingReview || submitted) && !isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-blue-200 shadow-xl shadow-blue-900/5 overflow-hidden"
          >
            <div className="bg-blue-50 border-b border-blue-100 px-8 py-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl ring-1 ring-blue-500/20">
                <Clock className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900">Verificación en Proceso</h2>
                <p className="text-blue-700 text-sm mt-0.5">Tu documentación está siendo revisada por nuestro equipo.</p>
              </div>
            </div>
            <div className="p-8">
              {/* Timeline */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="w-0.5 h-8 bg-emerald-200 mt-1" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Documentos Enviados</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {kycStatus?.documentType && `${formatDocumentType(kycStatus.documentType)} • ${kycStatus.documentNumber}`}
                      {kycStatus?.submittedAt && ` • ${new Date(kycStatus.submittedAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
                    </div>
                    <div className="w-0.5 h-8 bg-slate-200 mt-1" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Revisión del Equipo</p>
                    <p className="text-xs text-slate-500 mt-0.5">Estamos validando tu información. Este proceso puede tardar hasta 24–48 horas.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-slate-400 text-sm">Verificación Completada</p>
                    <p className="text-xs text-slate-400 mt-0.5">Recibirás la insignia de Abogado Verificado.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── REJECTED STATE ────────────────────────────────────── */}
        {isRejected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-red-200 shadow-xl shadow-red-900/5 overflow-hidden"
          >
            <div className="bg-red-50 border-b border-red-100 px-8 py-6 flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-xl ring-1 ring-red-500/20">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-900">Verificación Rechazada</h2>
                <p className="text-red-700 text-sm mt-0.5">
                  Tu documentación no pudo ser verificada. Por favor, revisa los datos e intenta nuevamente.
                </p>
              </div>
            </div>
            <div className="p-8">
              <UploadForm
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                isPending={isPending}
                error={error}
                isRetry
              />
            </div>
          </motion.div>
        )}

        {/* ── NEEDS UPLOAD STATE ────────────────────────────────── */}
        {needsUpload && !isRejected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden"
          >
            <div className="bg-amber-50 border-b border-amber-100 px-8 py-6 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-xl ring-1 ring-amber-500/20">
                <ShieldAlert className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Verificación Requerida</h2>
                <p className="text-slate-600 text-sm mt-0.5">
                  Sube tu documento de identidad para obtener la insignia de <span className="font-semibold text-slate-800">Abogado Verificado</span>.
                </p>
              </div>
            </div>
            <div className="p-8">
              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed"><span className="font-semibold text-slate-800">Insignia de confianza</span> visible en tu perfil público</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed"><span className="font-semibold text-slate-800">Enviar propuestas</span> a solicitudes de clientes</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <CreditCard className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed"><span className="font-semibold text-slate-800">Aparecer en búsquedas</span> del directorio público</p>
                </div>
              </div>

              <UploadForm
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                isPending={isPending}
                error={error}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Upload Form Component ────────────────────────────────────────────

function UploadForm({
  register,
  errors,
  handleSubmit,
  onSubmit,
  isPending,
  error,
  isRetry = false,
}: {
  register: any;
  errors: any;
  handleSubmit: any;
  onSubmit: (data: KycDocumentFormData) => void;
  isPending: boolean;
  error: string | null;
  isRetry?: boolean;
}) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-slate-400" />
          Tipo de Documento
        </label>
        <select
          {...register("documentType")}
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100 transition-all ${
            errors.documentType ? "border-red-500" : "border-slate-200"
          }`}
        >
          <option value="">Selecciona...</option>
          <option value="ID_CARD">Cédula de Identidad / DNI</option>
          <option value="PASSPORT">Pasaporte</option>
          <option value="DRIVER_LICENSE">Licencia de Conducir</option>
          <option value="BAR_CARD">Carnet de Colegiatura</option>
        </select>
        {errors.documentType && (
          <p className="text-xs text-red-600 mt-1">{errors.documentType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
          <Hash className="w-4 h-4 text-slate-400" />
          Número de Documento
        </label>
        <input
          {...register("documentNumber")}
          placeholder="Ej: 12.345.678-9"
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100 transition-all ${
            errors.documentNumber ? "border-red-500" : "border-slate-200"
          }`}
        />
        {errors.documentNumber && (
          <p className="text-xs text-red-600 mt-1">{errors.documentNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
          <Flag className="w-4 h-4 text-slate-400" />
          País de Emisión (Código)
        </label>
        <input
          {...register("documentCountryCode")}
          placeholder="Ej: PE, CL, ES, MX"
          maxLength={2}
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100 uppercase transition-all ${
            errors.documentCountryCode ? "border-red-500" : "border-slate-200"
          }`}
        />
        {errors.documentCountryCode && (
          <p className="text-xs text-red-600 mt-1">{errors.documentCountryCode.message}</p>
        )}
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-700 leading-relaxed">
          Tu información será tratada de forma confidencial y solo se usará para fines de verificación profesional.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
          </>
        ) : isRetry ? (
          "Reenviar Documentación"
        ) : (
          "Enviar para Verificación"
        )}
      </button>
    </form>
  );
}
