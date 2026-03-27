"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Star,
  Settings,
  FileText,
  ChevronRight
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
    <div className="min-h-screen bg-background pt-10 md:pt-16 pb-12 px-6 lg:px-10 max-w-[1600px] mx-auto">
      
      {/* Dashboard Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h2 className="text-4xl md:text-5xl font-manrope font-extrabold text-slate-900 tracking-tight mb-2">
          {greeting}, {user.firstName}.
        </h2>
        <p className="text-on-surface-variant font-medium text-lg">
          Tienes <span className="text-secondary font-bold">{stats?.pendingAppointments || 0} nuevas citas</span> por revisar.
        </p>
      </motion.div>

      {/* Verification Banners */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {!user.isVerified && (
          <div className="bg-amber-50/80 backdrop-blur-md rounded-2xl p-6 mb-10 border border-amber-200/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-600 shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 font-bold text-lg mb-0.5">Perfil pendiente de verificación</h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-3xl font-medium">
                Sube tus documentos colegiales para obtener la insignia de <span className="font-semibold text-slate-800">Abogado Verificado</span> y aumentar tu visibilidad en el directorio.
              </p>
            </div>
            <Link href="/dashboard/verification" className="w-full sm:w-auto mt-4 sm:mt-0 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 text-center whitespace-nowrap">
              Verificar ahora
            </Link>
          </div>
        )}

        {user.isVerified && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 mb-10 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-slate-800 font-medium text-sm">
              Tu perfil está <span className="font-bold text-emerald-700">verificado</span> y destacado en el directorio de Legit.
            </p>
          </div>
        )}
      </motion.div>

      {/* KPI Cards - Bento Grid Style */}
      {stats && !loadingStats && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12"
        >
          {/* Citas Pendientes */}
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:border-slate-200 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary transition-colors">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-wider">Por Atender</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-sm font-bold opacity-80 mb-1">Citas Pendientes</p>
              <h3 className="text-4xl font-manrope font-extrabold text-slate-900">{stats.pendingAppointments}</h3>
            </div>
          </div>

          {/* Propuestas Enviadas */}
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:border-slate-200 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 transition-colors">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-on-surface-variant text-sm font-bold opacity-80 mb-1">Propuestas Enviadas</p>
              <h3 className="text-4xl font-manrope font-extrabold text-slate-900">{stats.totalProposals}</h3>
            </div>
          </div>

          {/* Calificación Media */}
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:border-slate-200 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 transition-colors">
                <Star className="w-6 h-6 fill-amber-500/20" />
              </div>
              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-1 rounded uppercase tracking-wider">Experiencia</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-sm font-bold opacity-80 mb-1">Calificación Media</p>
              <h3 className="text-4xl font-manrope font-extrabold text-slate-900">{stats.ratingAvg?.toFixed(1) || "N/A"}</h3>
            </div>
          </div>

          {/* Total Reseñas */}
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:border-slate-200 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 transition-colors">
                <Eye className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-on-surface-variant text-sm font-bold opacity-80 mb-1">Total Reseñas</p>
              <h3 className="text-4xl font-manrope font-extrabold text-slate-900">{stats.reviewCount}</h3>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Access Block */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h3 className="text-2xl font-manrope font-extrabold text-slate-900">Accesos Rápidos</h3>
          <span className="w-fit px-3 py-1.5 bg-surface-container-low rounded-lg text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
            Acciones Frecuentes
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
           {/* Edit Profile */}
           <Link href="/dashboard/profile" className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low/40 border border-slate-100/50 group hover:border-secondary/20 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 cursor-pointer">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-600 group-hover:text-secondary group-hover:bg-secondary/5 transition-colors">
                 <Settings className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm font-extrabold text-slate-900 truncate">Configurar Perfil</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Gestión y Detalles</p>
               </div>
             </div>
             <div className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-3 group-hover:translate-x-0 group-hover:text-secondary">
                <ChevronRight className="w-5 h-5" />
             </div>
           </Link>

           {/* Public View */}
           <Link href={user.slug ? `/lawyer/${user.slug}` : "#"} target="_blank" className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low/40 border border-slate-100/50 group hover:border-secondary/20 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 cursor-pointer">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-600 group-hover:text-secondary group-hover:bg-secondary/5 transition-colors">
                 <Eye className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm font-extrabold text-slate-900 truncate">Vista Pública</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Así te ven los clientes</p>
               </div>
             </div>
             <div className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-3 group-hover:translate-x-0 group-hover:text-secondary">
                <ChevronRight className="w-5 h-5" />
             </div>
           </Link>

           {/* Manage Appointments */}
           <Link href="/dashboard/appointments" className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low/40 border border-slate-100/50 group hover:border-secondary/20 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 cursor-pointer">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-600 group-hover:text-secondary group-hover:bg-secondary/5 transition-colors">
                 <Clock className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm font-extrabold text-slate-900 truncate">Gestionar Citas</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Calendario de reservas</p>
               </div>
             </div>
             <div className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-3 group-hover:translate-x-0 group-hover:text-secondary">
                <ChevronRight className="w-5 h-5" />
             </div>
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
