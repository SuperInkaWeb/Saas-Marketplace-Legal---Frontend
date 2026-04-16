"use client";

import { motion } from "framer-motion";
import { 
  Briefcase, 
  Calendar, 
  FileText, 
  Plus, 
  ChevronRight,
  Search,
  MessageSquare,
  Settings,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
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

  const stats = [
    { label: "Casos activos", value: "Gestionar", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50", href: "/dashboard/my-cases" },
    { label: "Próximas citas", value: "Revisar", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50", href: "/dashboard/appointments" },
    { label: "Documentos", value: "Acceder", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50", href: "/dashboard/documents" },
    { label: "Mensajes", value: "Chat", icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50", href: "/dashboard/chats" },
  ];

  const quickActions = [
    { label: "Publicar Caso", sub: "Busca asesoría", icon: Plus, href: "/dashboard/my-cases"},
    { label: "Marketplace", sub: "Explorar expertos", icon: Search, href: "/marketplace"},
    { label: "Mi Perfil", sub: "Gestionar datos", icon: Settings, href: "/dashboard/profile"},
    { label: "Pagos", sub: "Facturación", icon: CreditCard, href: "/dashboard/payments"},
  ];

  return (
    <div className="min-h-screen bg-white pt-10 md:pt-16 pb-12 px-6 lg:px-10 max-w-[1600px] mx-auto font-['Inter',sans-serif]">
      
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 relative"
      >
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
          {greeting}, <span className="text-emerald-600">{user.firstName}</span>.
        </h2>
        <p className="text-slate-500 font-medium text-lg">
          Gestiona tus asuntos legales desde tu panel de control personalizado.
        </p>
      </motion.div>

      {/* KPI Cards - Bento Grid Style */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={idx} 
              href={stat.href}
              className="bg-white p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:border-emerald-600/20 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white", stat.bg, stat.color)}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-bold mb-1">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-900 leading-none">{stat.value}</h3>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* Quick Access Block */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h3 className="text-2xl font-extrabold text-slate-900">Accesos Rápidos</h3>
          <span className="w-fit px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Acciones Frecuentes
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
           {quickActions.map((action, idx) => {
             const Icon = action.icon;
             return (
               <Link 
                key={idx} 
                href={action.href} 
                className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:border-emerald-600/20 hover:bg-white hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-300 cursor-pointer"
               >
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-600 group-hover:text-emerald-600 group-hover:bg-emerald-600/5 transition-colors">
                     <Icon className="w-6 h-6" />
                   </div>
                   <div>
                     <p className="text-sm font-extrabold text-slate-900 truncate">{action.label}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{action.sub}</p>
                   </div>
                 </div>
                 <div className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-3 group-hover:translate-x-0 group-hover:text-emerald-600">
                    <ChevronRight className="w-5 h-5" />
                 </div>
               </Link>
             );
           })}
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-1/2 h-full bg-emerald-600/10 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-4 border border-emerald-500/10">
              Seguridad Garantizada
            </div>
            <h3 className="text-3xl font-extrabold mb-4">¿Necesitas un abogado ahora?</h3>
            <p className="text-slate-400 font-medium">
              Explora nuestro marketplace de profesionales verificados. Publica tu requerimiento legal y recibe propuestas en tiempo real de expertos en la materia.
            </p>
          </div>
          <Link href="/marketplace" className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40">
            Ir al Marketplace
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
