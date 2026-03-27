"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Clock,
  Briefcase,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Star,
  Settings
} from "lucide-react";
import Link from "next/link";
import { DashboardStatsResponse } from "@/modules/marketplace/types";

interface LawyerDashboardHomeProps {
  user: any;
  stats: DashboardStatsResponse | null;
  loadingStats: boolean;
  greeting: string;
}

export function LawyerDashboardHome({ user, stats, loadingStats, greeting }: LawyerDashboardHomeProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Top Background Pattern/Gradient */}
      <div className="bg-slate-900 px-6 pt-12 pb-24 lg:px-10 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-emerald-300 text-xs font-medium mb-4 backdrop-blur-md shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Panel de Abogado
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
              >
                {greeting}, <span className="text-emerald-400">{user.firstName}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-300 mt-3 text-lg max-w-xl leading-relaxed"
              >
                Aquí tienes tu resumen de actividad profesional. Mantén al día tus casos, propuestas y reuniones con clientes.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden md:block"
            >
              <Link href="/dashboard/profile" className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold shadow-xl shadow-black/10 ring-1 ring-white/20 hover:bg-slate-50 transition-all hover:-translate-y-1">
                <Settings className="w-5 h-5 text-slate-700" />
                Ajustes de Perfil
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 -mt-12 space-y-8 relative z-20">
        {!user.isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl border border-amber-200/80 rounded-2xl p-5 flex items-start sm:items-center gap-4 shadow-xl shadow-amber-900/5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
            <div className="bg-amber-100/70 p-3 rounded-xl shrink-0 ring-1 ring-amber-500/20">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 font-bold text-lg">Perfil pendiente de verificación</h3>
              <p className="text-slate-500 text-sm mt-0.5 leading-relaxed max-w-3xl">
                Sube tus documentos colegiales para obtener la insignia de <span className="font-semibold text-slate-700">Abogado Verificado</span> y aumentar tu visibilidad en el directorio.
              </p>
            </div>
            <button className="hidden sm:inline-flex shrink-0 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-slate-900/20 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap">
              Verificar ahora
            </button>
          </motion.div>
        )}

        {user.isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl border border-emerald-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xl shadow-emerald-900/5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
            <div className="bg-emerald-100/70 p-2.5 rounded-xl shrink-0 ring-1 ring-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-slate-800 font-medium text-base">
              Tu perfil está <span className="font-bold text-emerald-700">verificado</span> y destacado en las búsquedas de clientes.
            </p>
          </motion.div>
        )}

        {stats && !loadingStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Clock className="w-28 h-28 -mr-8 -mt-8 text-blue-600" />
              </div>
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="bg-blue-50/80 p-3 rounded-xl ring-1 ring-blue-500/10">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="relative z-10">
                <h4 className="text-4xl font-extrabold text-slate-900 tracking-tight">{stats.pendingAppointments}</h4>
                <p className="text-slate-500 text-sm font-medium mt-1.5">Citas Pendientes</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Briefcase className="w-28 h-28 -mr-8 -mt-8 text-emerald-600" />
              </div>
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="bg-emerald-50/80 p-3 rounded-xl ring-1 ring-emerald-500/10">
                  <Briefcase className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="relative z-10">
                <h4 className="text-4xl font-extrabold text-slate-900 tracking-tight">{stats.totalProposals}</h4>
                <p className="text-slate-500 text-sm font-medium mt-1.5">Propuestas Enviadas</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Star className="w-28 h-28 -mr-8 -mt-8 text-amber-500" />
              </div>
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="bg-amber-50/80 p-3 rounded-xl ring-1 ring-amber-500/20">
                  <Star className="w-6 h-6 text-amber-600 fill-amber-500/20" />
                </div>
              </div>
              <div className="relative z-10">
                <h4 className="text-4xl font-extrabold text-slate-900 tracking-tight">{stats.ratingAvg?.toFixed(1) || "N/A"}</h4>
                <p className="text-slate-500 text-sm font-medium mt-1.5">Calificación Media</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Eye className="w-28 h-28 -mr-8 -mt-8 text-purple-600" />
              </div>
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="bg-purple-50/80 p-3 rounded-xl ring-1 ring-purple-500/10">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="relative z-10">
                <h4 className="text-4xl font-extrabold text-slate-900 tracking-tight">{stats.reviewCount}</h4>
                <p className="text-slate-500 text-sm font-medium mt-1.5">Total Reseñas</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Accesos Rápidos</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link href="/dashboard/profile" className="group block bg-white p-7 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-300/50 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-slate-50 p-3.5 rounded-xl ring-1 ring-slate-100 group-hover:bg-emerald-50 group-hover:ring-emerald-100 transition-all">
                  <Settings className="w-6 h-6 text-slate-600 group-hover:text-emerald-600" />
                </div>
                <div className="w-10 h-10 ml-auto rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-1.5 group-hover:text-emerald-700 transition-colors">Editar Perfil</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Actualiza tus honorarios, horarios de atención y datos profesionales públicos.</p>
              </div>
            </Link>

            <Link href={user.slug ? `/lawyer/${user.slug}` : "#"} target="_blank" className="group block bg-white p-7 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-300/50 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-slate-50 p-3.5 rounded-xl ring-1 ring-slate-100 group-hover:bg-blue-50 group-hover:ring-blue-100 transition-all">
                  <Eye className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
                </div>
                <div className="w-10 h-10 ml-auto rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-1.5 group-hover:text-blue-700 transition-colors">Vista Pública</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Mira exactamente cómo ven tu perfil los clientes potenciales y las empresas.</p>
              </div>
            </Link>

            <Link href="/dashboard/appointments" className="group block bg-white p-7 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-xl hover:shadow-purple-900/5 hover:border-purple-300/50 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-slate-50 p-3.5 rounded-xl ring-1 ring-slate-100 group-hover:bg-purple-50 group-hover:ring-purple-100 transition-all">
                  <Clock className="w-6 h-6 text-slate-600 group-hover:text-purple-600" />
                </div>
                <div className="w-10 h-10 ml-auto rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-1.5 group-hover:text-purple-700 transition-colors">Gestionar Citas</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Revisa y responde a tus solicitudes de asesoría legales programadas.</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
