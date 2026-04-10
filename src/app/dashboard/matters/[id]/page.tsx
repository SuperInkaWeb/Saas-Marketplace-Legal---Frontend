"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { matterService } from "@/modules/matter/services/matterService";
import { MatterResponse, MatterStatus } from "@/modules/matter/types";
import { 
  ArrowLeft, Briefcase, Calendar, ChevronRight, Clock, 
  FileText, MessagesSquare, Scale, UserCircle, CheckCircle2,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function MatterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const publicId = params.id as string;
  
  const [matter, setMatter] = useState<MatterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"RESUMEN" | "DOCUMENTOS" | "TAREAS" | "FACTURACION">("RESUMEN");

  useEffect(() => {
    if (publicId) {
      fetchMatter();
    }
  }, [publicId]);

  const fetchMatter = async () => {
    try {
      setLoading(true);
      const data = await matterService.getMatterByPublicId(publicId);
      setMatter(data);
    } catch (error) {
      toast.error("No se pudo cargar la información del expediente");
      router.push("/dashboard/matters");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: MatterStatus) => {
    switch (status) {
      case 'OPEN': return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'Abierto', icon: <Briefcase className="w-3.5 h-3.5" /> };
      case 'IN_PROGRESS': return { color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'En Progreso', icon: <Clock className="w-3.5 h-3.5" /> };
      case 'PENDING_CLIENT': return { color: 'bg-amber-100 text-amber-700 border-amber-200', text: 'Esperando Cliente', icon: <AlertCircle className="w-3.5 h-3.5" /> };
      case 'IN_LITIGATION': return { color: 'bg-rose-100 text-rose-700 border-rose-200', text: 'En Litigio', icon: <Scale className="w-3.5 h-3.5" /> };
      case 'SETTLED': return { color: 'bg-violet-100 text-violet-700 border-violet-200', text: 'Acuerdo', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
      case 'CLOSED': return { color: 'bg-slate-100 text-slate-700 border-slate-200', text: 'Cerrado', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
      default: return { color: 'bg-slate-100 text-slate-700 border-slate-200', text: status, icon: <Briefcase className="w-3.5 h-3.5" /> };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center animate-pulse mb-4">
          <Briefcase className="w-6 h-6 text-indigo-400" />
        </div>
        <p className="text-sm font-medium text-slate-500 animate-pulse">Abriendo expediente de los archivos...</p>
      </div>
    );
  }

  if (!matter) return null;

  const statusConfig = getStatusConfig(matter.status);

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-6">
        <Link href="/dashboard/matters" className="hover:text-slate-900 flex items-center gap-1 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Expedientes
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {matter.number}
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Scale className="w-64 h-64 -translate-y-1/4 translate-x-1/4" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${statusConfig.color}`}>
                  {statusConfig.icon}
                  {statusConfig.text}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  <Scale className="w-3.5 h-3.5" />
                  {matter.jurisdiction || "Sin Jurisdicción"}
                </span>
                <span className="inline-flex items-center text-xs font-medium text-slate-400">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Aperturado {format(new Date(matter.startDate), "dd MMM yyyy", { locale: es })}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                {matter.title}
              </h1>
              <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
                {matter.description || "Este expediente no tiene una descripción detallada provista por el abogado al momento de su creación."}
              </p>
            </div>

            <div className="md:text-right shrink-0">
              <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Cliente Vinculado</p>
              <div className="flex items-center md:justify-end gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserCircle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-slate-900">{matter.clientName}</p>
                  <p className="text-xs font-medium text-indigo-600 flex items-center gap-1 cursor-pointer hover:underline">
                    Ver Pefil <ChevronRight className="w-3 h-3" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column - Tabs Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {["RESUMEN", "DOCUMENTOS", "TAREAS", "FACTURACION"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${activeTab === tab ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 translate-x-1 border border-indigo-500" : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"}`}
            >
              {tab === "RESUMEN" && <Briefcase className={`w-4 h-4 ${activeTab === tab ? "text-indigo-200" : "text-slate-400"}`} />}
              {tab === "DOCUMENTOS" && <FileText className={`w-4 h-4 ${activeTab === tab ? "text-indigo-200" : "text-slate-400"}`} />}
              {tab === "TAREAS" && <Calendar className={`w-4 h-4 ${activeTab === tab ? "text-indigo-200" : "text-slate-400"}`} />}
              {tab === "FACTURACION" && <CheckCircle2 className={`w-4 h-4 ${activeTab === tab ? "text-indigo-200" : "text-slate-400"}`} />}
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Right Column - Tab Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 min-h-[400px]"
            >
              
              {activeTab === "RESUMEN" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-500" /> Historial Reciente (Próximamente)
                    </h3>
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500">
                      Aquí aparecerán las notas, comunicaciones y el log de auditoría del caso.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "DOCUMENTOS" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" /> Documentos Vinculados
                    </h3>
                    <button className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                      Vincular Existente
                    </button>
                  </div>
                  <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white text-slate-500">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="font-bold text-slate-700 mb-1">No hay documentos en este expediente</p>
                    <p className="text-sm max-w-sm mx-auto mb-4">Usa el Generador de Documentos y asígnalos a este expediente para centralizarlos aquí.</p>
                    <Link href="/dashboard/documents" className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors inline-block">
                      Ir al Generador
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === "TAREAS" && (
                <div className="p-12 text-center text-slate-500">
                  Tablero de Tareas de Expediente programado para el Sprint de Calendario.
                </div>
              )}
              
              {activeTab === "FACTURACION" && (
                <div className="p-12 text-center text-slate-500">
                  Módulo de registro de horas facturables y liquidaciones en desarrollo (ERP Time Billing).
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
