"use client";

import { useAdminDashboard } from "@/modules/admin/hooks";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Briefcase,
  ShieldAlert,
  Calendar,
  Star,
  TrendingUp,
  DollarSign,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error al cargar las métricas del dashboard.
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Usuarios",
      value: stats.totalUsers,
      icon: Users,
      color: "blue",
      bg: "bg-blue-50",
      ring: "ring-blue-500/10",
      iconColor: "text-blue-600",
      bgIcon: "text-blue-600",
    },
    {
      label: "Abogados",
      value: stats.totalLawyers,
      icon: Briefcase,
      color: "emerald",
      bg: "bg-emerald-50",
      ring: "ring-emerald-500/10",
      iconColor: "text-emerald-600",
      bgIcon: "text-emerald-600",
    },
    {
      label: "Clientes",
      value: stats.totalClients,
      icon: UserCheck,
      color: "purple",
      bg: "bg-purple-50",
      ring: "ring-purple-500/10",
      iconColor: "text-purple-600",
      bgIcon: "text-purple-600",
    },
    {
      label: "Verificaciones Pendientes",
      value: stats.pendingVerifications,
      icon: ShieldAlert,
      color: "amber",
      bg: "bg-amber-50",
      ring: "ring-amber-500/20",
      iconColor: "text-amber-600",
      bgIcon: "text-amber-600",
      href: "/admin/verifications",
    },
    {
      label: "Total Citas",
      value: stats.totalAppointments,
      icon: Calendar,
      color: "sky",
      bg: "bg-sky-50",
      ring: "ring-sky-500/10",
      iconColor: "text-sky-600",
      bgIcon: "text-sky-600",
    },
    {
      label: "Total Reseñas",
      value: stats.totalReviews,
      icon: Star,
      color: "orange",
      bg: "bg-orange-50",
      ring: "ring-orange-500/10",
      iconColor: "text-orange-600",
      bgIcon: "text-orange-600",
    },
    {
      label: "Registro últimos 7 días",
      value: stats.recentRegistrations,
      icon: TrendingUp,
      color: "teal",
      bg: "bg-teal-50",
      ring: "ring-teal-500/10",
      iconColor: "text-teal-600",
      bgIcon: "text-teal-600",
    },
    {
      label: "Ingresos del Mes",
      value: `$${stats.monthlyRevenue.toLocaleString("es", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "green",
      bg: "bg-green-50",
      ring: "ring-green-500/10",
      iconColor: "text-green-600",
      bgIcon: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <div className="bg-slate-900 px-6 pt-12 pb-24 lg:px-10 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-emerald-300 text-xs font-medium mb-4 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Panel de Administración
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Métricas de la <span className="text-emerald-400">Plataforma</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 mt-3 text-lg max-w-xl leading-relaxed"
          >
            Monitorea el estado de la plataforma en tiempo real. Todos los datos son obtenidos directamente del servidor.
          </motion.p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 -mt-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {statCards.map((card, i) => {
            const Icon = card.icon;
            const CardWrapper = card.href ? Link : "div";
            const wrapperProps = card.href ? { href: card.href } : {};

            return (
              <CardWrapper
                key={card.label}
                {...(wrapperProps as any)}
                className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon className={`w-28 h-28 -mr-8 -mt-8 ${card.bgIcon}`} />
                </div>
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <div className={`${card.bg} p-3 rounded-xl ring-1 ${card.ring}`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                </div>
                <div className="relative z-10">
                  <h4 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {card.value}
                  </h4>
                  <p className="text-slate-500 text-sm font-medium mt-1.5">
                    {card.label}
                  </p>
                </div>
              </CardWrapper>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
