"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAdminUserDetail, useUpdateAccountStatus } from "@/modules/admin/hooks";
import { motion } from "framer-motion";
import {
  Loader2,
  ChevronLeft,
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  ShieldBan,
  Briefcase,
  MapPin,
  Star,
  FileText,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminUserDetailPage({ params }: { params: Promise<{ publicId: string }> }) {
  const router = useRouter();
  const { publicId } = use(params);
  
  const { data: user, isLoading, error } = useAdminUserDetail(publicId);
  const updateStatus = useUpdateAccountStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-800">Usuario no encontrado</h2>
        <button onClick={() => router.back()} className="text-indigo-600 hover:underline">
          Volver a la lista
        </button>
      </div>
    );
  }

  const handleToggleStatus = async () => {
    const newStatus = user.accountStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const action = newStatus === "BLOCKED" ? "bloquear" : "activar";

    if (!confirm(`¿Seguro que deseas ${action} esta cuenta?`)) return;

    try {
      await updateStatus.mutateAsync({
        publicId: user.publicId,
        body: { accountStatus: newStatus },
      });
      toast.success(`Cuenta ${newStatus === "BLOCKED" ? "bloqueada" : "activada"} exitosamente.`);
    } catch {
      toast.error("Error al actualizar el estado de la cuenta.");
    }
  };

  const isLawyer = user.role === "LAWYER";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <div className="bg-slate-900 px-6 pt-12 pb-24 lg:px-10 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium mb-6 backdrop-blur-md transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver a usuarios
          </button>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                  isLawyer ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : 
                  user.role === "ADMIN" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : 
                  "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                )}>
                  {user.role}
                </span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                  user.accountStatus === "ACTIVE" ? "bg-green-500/20 text-green-300 border-green-500/30" :
                  user.accountStatus === "BLOCKED" ? "bg-red-500/20 text-red-300 border-red-500/30" :
                  "bg-amber-500/20 text-amber-300 border-amber-500/30"
                )}>
                  {user.accountStatus}
                </span>
                {user.isVerified && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verificado
                  </span>
                )}
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {user.fullName}
              </h1>
              <p className="text-slate-300 mt-2 text-base flex items-center gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
            </div>
            
            {user.role !== "ADMIN" && (
              <button
                onClick={handleToggleStatus}
                disabled={updateStatus.isPending}
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50",
                  user.accountStatus === "ACTIVE"
                    ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                )}
              >
                {updateStatus.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> :
                  user.accountStatus === "ACTIVE" ? <><ShieldBan className="w-4 h-4" /> Bloquear Cuenta</> : <><ShieldCheck className="w-4 h-4" /> Activar Cuenta</>
                }
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 -mt-12 relative z-20 space-y-6">
        
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm flex flex-col"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indigo-500" />
              Información Personal
            </h3>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Nombre Completo</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{user.fullName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Correo Electrónico</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Teléfono</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{user.phoneNumber || "No especificado"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" /> Fecha de Registro
                </p>
                <p className="text-sm font-medium text-slate-800 mt-1">
                  {format(new Date(user.createdAt), "PPP 'a las' p", { locale: es })}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Paso de Onboarding
                </p>
                <p className="text-sm font-medium text-slate-800 mt-1">{user.onboardingStep}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* KYC Data — solo para abogados, ya que los clientes no registran documentos de identidad */}
            {isLawyer && (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Documento de Identidad (KYC)
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Tipo</p>
                    <p className="text-sm font-medium text-slate-800 mt-1">{user.kycDocumentType || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Número</p>
                    <p className="text-sm font-medium text-slate-800 mt-1">{user.kycDocumentNumber || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">País</p>
                    <p className="text-sm font-medium text-slate-800 mt-1">{user.kycCountryCode || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Estado KYC</p>
                    <div className="mt-1">
                      {user.kycIsVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Verificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          <AlertCircle className="w-3 h-3" /> Pendiente
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General Location */}
            {user.city && user.country && (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Ubicación
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Ciudad</p>
                    <p className="text-sm font-medium text-slate-800 mt-1">{user.city}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">País</p>
                    <p className="text-sm font-medium text-slate-800 mt-1">{user.country}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Lawyer Specific Details */}
        {isLawyer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-500" />
              Perfil Profesional y Credenciales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Colegiatura</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{user.barRegistrationNumber || "—"}</p>
              </div>
               <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Colegio de Abogados</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{user.barAssociation || "—"}</p>
              </div>
               <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Estado Verificación (Abogado)</p>
                <div className="mt-1">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-bold",
                      user.verificationStatus === "VERIFIED" ? "bg-emerald-50 text-emerald-600" :
                      user.verificationStatus === "REJECTED" ? "bg-red-50 text-red-600" :
                      "bg-amber-50 text-amber-600"
                    )}>
                      {user.verificationStatus || "PENDING"}
                    </span>
                  </div>
              </div>
               <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Tarifa por Hora</p>
                <p className="text-sm font-medium text-slate-800 mt-1">
                  {user.hourlyRate ? `${user.currency} ${user.hourlyRate.toFixed(2)}` : "—"}
                </p>
              </div>
               <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Calificación Promedio</p>
                <p className="text-sm font-medium text-slate-800 mt-1 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {user.ratingAvg?.toFixed(1) || "Sin calificar"}
                </p>
              </div>
               <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Total de Reseñas</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{user.reviewCount} reseñas</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
