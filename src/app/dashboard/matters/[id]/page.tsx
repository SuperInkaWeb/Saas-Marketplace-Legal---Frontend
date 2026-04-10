"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { matterService } from "@/modules/matter/services/matterService";
import { matterEventService } from "@/modules/matter/services/matterEventService";
import { matterTaskService } from "@/modules/matter/services/matterTaskService";
import { documentService } from "@/modules/document/services/documentService";
import { 
  MatterResponse, MatterStatus, MatterEventResponse, 
  MatterTaskResponse, MatterEventType 
} from "@/modules/matter/types";
import { DocumentResponse } from "@/modules/document/types";
import { 
  ArrowLeft, Briefcase, Calendar, ChevronRight, Clock, 
  FileText, MessagesSquare, Scale, UserCircle, CheckCircle2,
  AlertCircle, Plus, LayoutDashboard, History, Settings2, Trash2,
  Paperclip, ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MatterTimeline } from "@/modules/matter/components/MatterTimeline";
import { MatterTaskList } from "@/modules/matter/components/MatterTaskList";
import { DocumentPreviewModal } from "@/modules/document/components/DocumentPreviewModal";

export default function MatterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const publicId = params.id as string;
  
  const [matter, setMatter] = useState<MatterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"RESUMEN" | "DOCUMENTOS" | "TAREAS" | "FACTURACION">("RESUMEN");

  // Data States
  const [events, setEvents] = useState<MatterEventResponse[]>([]);
  const [tasks, setTasks] = useState<MatterTaskResponse[]>([]);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);

  // Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    eventType: "NOTE" as MatterEventType,
    eventDate: new Date().toISOString().split('T')[0]
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: ""
  });

  useEffect(() => {
    if (publicId) {
      fetchMatter();
      fetchEvents();
      fetchTasks();
      fetchDocuments();
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

  const fetchEvents = async () => {
    try {
      const data = await matterEventService.getEvents(publicId);
      setEvents(data);
    } catch (e) { console.error(e); }
  };

  const fetchTasks = async () => {
    try {
      const data = await matterTaskService.getTasks(publicId);
      setTasks(data);
    } catch (e) { console.error(e); }
  };

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocumentsByMatter(publicId);
      setDocuments(data);
    } catch (e) { console.error(e); }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await matterEventService.addEvent(publicId, {
        ...eventForm,
        eventDate: new Date(eventForm.eventDate).toISOString()
      });
      toast.success("Evento agregado al historial");
      setIsEventModalOpen(false);
      setEventForm({ title: "", description: "", eventType: "NOTE", eventDate: new Date().toISOString().split('T')[0] });
      fetchEvents();
    } catch (e) {
      toast.error("Error al guardar el evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await matterTaskService.addTask(publicId, {
        ...taskForm,
        dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : undefined
      });
      toast.success("Tarea creada y notificada");
      setIsTaskModalOpen(false);
      setTaskForm({ title: "", description: "", dueDate: "" });
      fetchTasks();
    } catch (e) {
      toast.error("Error al crear tarea");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskPublicId: string) => {
    try {
      await matterTaskService.toggleTask(taskPublicId);
      fetchTasks();
    } catch (e) {
      toast.error("Error al actualizar tarea");
    }
  };

  const handleDeleteDocument = async (docPublicId: string) => {
    try {
      await documentService.archiveDocument(docPublicId);
      toast.success("Documento archivado/eliminado");
      fetchDocuments();
    } catch (e) {
      toast.error("Error al eliminar documento");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await documentService.uploadMatterDocument(publicId, file);
      toast.success("Documento subido correctamente a Cloudinary");
      fetchDocuments();
    } catch (e) {
      toast.error("Error al subir el archivo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePreview = (doc: DocumentResponse) => {
    setSelectedDocument(doc);
    setIsPreviewModalOpen(true);
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
          {[
            { id: "RESUMEN", label: "Resumen", icon: History },
            { id: "DOCUMENTOS", label: "Documentos", icon: FileText },
            { id: "TAREAS", label: "Tareas", icon: CheckCircle2 },
            { id: "FACTURACION", label: "Facturación", icon: Briefcase }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 translate-x-1 border border-indigo-500" : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"}`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-200" : "text-slate-400"}`} />
              {tab.label}
            </button>
          ))}
          
          <div className="pt-6">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Acciones de Gestión</h4>
            <div className="space-y-1">
               <button onClick={() => setIsEventModalOpen(true)} className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Registrar Actuación
               </button>
               <button onClick={() => setIsTaskModalOpen(true)} className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Nueva Tarea
               </button>
               <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-400 cursor-not-allowed rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" /> Archivar Expediente
               </button>
            </div>
          </div>
        </div>

        {/* Right Column - Tab Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 min-h-[500px]"
            >
              
              {activeTab === "RESUMEN" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                       <History className="w-5 h-5 text-indigo-500" /> Cronología de Actuaciones
                    </h3>
                    <button 
                      onClick={() => setIsEventModalOpen(true)}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      + Agregar Evento
                    </button>
                  </div>
                  <MatterTimeline events={events} />
                </div>
              )}

              {activeTab === "DOCUMENTOS" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" /> Archivo Digital
                    </h3>
                    <div className="flex gap-2">
                       {/* Hidden file input */}
                       <input 
                         type="file" 
                         className="hidden" 
                         ref={fileInputRef} 
                         onChange={handleFileUpload}
                         accept=".pdf,.doc,.docx,.jpg,.png"
                       />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isUploading ? (
                          <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Paperclip className="w-3 h-3" />
                        )}
                        Subir Archivo
                      </button>
                      <Link href="/dashboard/documents" className="text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
                        Generador
                      </Link>
                    </div>
                  </div>
                  
                  {documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((doc) => (
                        <div key={doc.publicId} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 hover:bg-white transition-all cursor-pointer" onClick={() => handlePreview(doc)}>
                          <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 shadow-sm transition-all">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{doc.fileName}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                              {format(new Date(doc.createdAt), "dd MMM yyyy", { locale: es })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              className="text-slate-400 hover:text-indigo-600 p-2 transition-colors" 
                              onClick={(e) => { e.stopPropagation(); handlePreview(doc); }}
                              title="Ver documento"
                            >
                               <ExternalLink className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-slate-400 hover:text-red-500 p-2 transition-colors" 
                              onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.publicId); }}
                              title="Eliminar"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                        <FileText className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="font-bold text-slate-700 mb-1">El expediente está vacío</p>
                      <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">Usa el sistema para generar documentos o subir archivos escaneados para centralizarlos aquí.</p>
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                          {isUploading ? (
                            <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Paperclip className="w-3 h-3" />
                          )}
                          Subir Archivo
                        </button>
                        <Link href="/dashboard/documents" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-200 inline-block hover:scale-105 transition-all">
                          Ir al Generador
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "TAREAS" && (
                <div>
                   <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                       <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Tareas del Expediente
                    </h3>
                    <button 
                      onClick={() => setIsTaskModalOpen(true)}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      + Nueva Tarea
                    </button>
                  </div>
                  <MatterTaskList tasks={tasks} onToggleStatus={handleToggleTask} />
                </div>
              )}
              
              {activeTab === "FACTURACION" && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                   <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100">
                      <AlertCircle className="w-10 h-10 text-amber-500" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">Módulo de Facturación</h3>
                   <p className="text-slate-500 max-w-xs mx-auto">El registro de horas facturables y liquidaciones estará disponible en la Fase 3 del ERP.</p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* MODALS */}
      
      {/* Event Modal */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEventModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10">
               <div className="p-6 border-b border-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">Registrar Actuación</h3>
                  <p className="text-sm text-slate-500 px-0.5">Agrega un evento relevante al historial del caso.</p>
               </div>
               <form onSubmit={handleAddEvent} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Título del Evento</label>
                    <input required type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium" placeholder="Ej. Presentación de memorial" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Categoría</label>
                      <select value={eventForm.eventType} onChange={e => setEventForm({...eventForm, eventType: e.target.value as any})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium">
                        <option value="HEARING">Audiencia</option>
                        <option value="FILING">Escrito</option>
                        <option value="NOTIFICATION">Notificación</option>
                        <option value="NOTE">Nota Interna</option>
                        <option value="MEETING">Reunión</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Fecha</label>
                      <input type="date" value={eventForm.eventDate} onChange={e => setEventForm({...eventForm, eventDate: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Notas adicionales</label>
                    <textarea rows={3} value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium resize-none" placeholder="Opcional..." />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsEventModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                    <button disabled={isSubmitting} type="submit" className="flex-1 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50">Guardar</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTaskModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10">
               <div className="p-6 border-b border-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">Nueva Tarea</h3>
                  <p className="text-sm text-slate-500 px-0.5">Se enviará una notificación al asignar la tarea.</p>
               </div>
               <form onSubmit={handleAddTask} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">¿Qué se debe hacer?</label>
                    <input required type="text" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium" placeholder="Ej. Revisar apelación del cliente" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Fecha límite (Opcional)</label>
                    <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Instrucciones</label>
                    <textarea rows={3} value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium resize-none" placeholder="..." />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                    <button disabled={isSubmitting} type="submit" className="flex-1 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50">Asignar</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        document={selectedDocument}
      />

    </div>
  );
}
