"use client";

import { motion } from "framer-motion";
import { 
  Briefcase, 
  Calendar, 
  FileText, 
  Plus, 
  ArrowRight,
  Clock,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

interface ClientDashboardHomeProps {
  user: any;
}

export function ClientDashboardHome({ user }: ClientDashboardHomeProps) {
  const hour = new Date().getHours();
  let greeting = "Hola";
  if (hour < 12) greeting = "Buenos días";
  else if (hour < 19) greeting = "Buenas tardes";
  else greeting = "Buenas noches";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="bg-slate-900 px-6 pt-12 pb-24 lg:px-10 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-emerald-300 text-xs font-medium mb-4 backdrop-blur-md"
              >
                Panel de Cliente
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
                className="text-slate-300 mt-3 text-lg max-w-xl"
              >
                Gestiona tus casos legales y agenda citas con profesionales expertos de forma segura.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/dashboard/my-cases" className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-400 transition-all hover:-translate-y-1">
                <Plus className="w-5 h-5" />
                Publicar Nuevo Caso
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 -mt-12 space-y-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stat: Active Cases */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Casos Activos</p>
              <h4 className="text-2xl font-bold text-slate-900">Gestionar</h4>
            </div>
            <Link href="/dashboard/my-cases" className="ml-auto text-slate-300 hover:text-slate-600">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Quick Stat: Appointments */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Próximas Citas</p>
              <h4 className="text-2xl font-bold text-slate-900">Revisar</h4>
            </div>
            <Link href="/dashboard/appointments" className="ml-auto text-slate-300 hover:text-slate-600">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Quick Stat: Documents */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Documentos</p>
              <h4 className="text-2xl font-bold text-slate-900">Acceder</h4>
            </div>
            <Link href="/dashboard/documents" className="ml-auto text-slate-300 hover:text-slate-600">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Featured Section for Clients */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                Expertos Disponibles
              </div>
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                Encuentra al abogado ideal para tu necesidad legal
              </h2>
              <p className="text-slate-500 text-lg">
                Explora cientos de profesionales verificados por especialidad, ubicación y calificación. Publica tu caso y recibe propuestas competitivas en minutos.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/marketplace/lawyers" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                  Explorar Abogados
                </Link>
                <Link href="/marketplace/cases" className="px-6 py-3 bg-white text-slate-900 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-all">
                  Ver Casos Públicos
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-slate-50 rounded-2xl p-8 space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-sm">Abogados 100% Verificados</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Clock className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-sm">Respuesta en menos de 24h</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FileText className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-sm">Firma digital integrada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
