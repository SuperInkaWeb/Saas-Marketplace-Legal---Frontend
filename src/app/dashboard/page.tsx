"use client";

import { useAuthStore } from "@/modules/auth/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [greeting, setGreeting] = useState("Hola");

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.onboardingStep !== "COMPLETED") {
      router.replace("/onboarding/rol");
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 19) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");
  }, [user, router]);

  if (!user) return null;

  const isLawyer = user.role === "LAWYER";

  // Fake stats / derived stats
  const profileViews = isLawyer ? 142 : 0;
  const rating = isLawyer ? 4.8 : 0;
  const schedulesCount = user.schedules?.length || 0;
  const specialtiesCount = user.specialties?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-slate-900 tracking-tight"
            >
              {greeting}, {user.firstName}!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 mt-1"
            >
              Aquí tienes un resumen de tu actividad en Legit.
            </motion.p>
          </div>
        </div>

        {/* Verification Banner */}
        {!user.isVerified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-4"
          >
            <div className="bg-amber-100 p-2 rounded-full shrink-0">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-amber-900 font-semibold">Perfil pendiente de verificación</h3>
              <p className="text-amber-700/80 text-sm mt-0.5">
                Sube tus documentos colegiales para obtener la insignia de "Abogado Verificado" y aumentar tu visibilidad.
              </p>
            </div>
            <button className="hidden sm:block shrink-0 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors">
              Verificar ahora
            </button>
          </motion.div>
        )}

        {user.isVerified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
          >
            <div className="bg-emerald-100 p-2 rounded-full shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-emerald-900 font-medium text-sm">
              Tu perfil está verificado y destacado en las búsquedas.
            </p>
          </motion.div>
        )}

        {/* Stats Grid (Lawyers only for now) */}
        {isLawyer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-50 p-2.5 rounded-xl">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12% este mes</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Búsquedas y Visitas</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">{profileViews}</h4>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-amber-50 p-2.5 rounded-xl">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">Calificación Media</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">{rating.toFixed(1)}</h4>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-emerald-50 p-2.5 rounded-xl">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">Bloques de Horario</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">{schedulesCount}</h4>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-50 p-2.5 rounded-xl">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">Especialidades</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">{specialtiesCount}</h4>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        {isLawyer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/dashboard/profile" className="group flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-emerald-50 transition-colors">
                    <Settings className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Editar Perfil</h4>
                    <p className="text-sm text-slate-500">Actualiza tarifas, horarios y datos.</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors group-hover:translate-x-1" />
              </Link>

              <Link href={user.slug ? `/lawyer/${user.slug}` : "#"} target="_blank" className="group flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
                    <Eye className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Vista Pública</h4>
                    <p className="text-sm text-slate-500">Mira cómo te ven los clientes.</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
